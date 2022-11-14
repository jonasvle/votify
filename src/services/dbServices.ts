import {
  push,
  ref,
  set,
  update,
  remove,
  child,
  get,
  increment,
} from "firebase/database";

import { database } from "@/configs/firebase";
import {
  STATUS,
  TYPE,
  type Member,
  type Option,
  type Vote,
} from "@/common/interfaces";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

export const createVote = async (vote: Vote) => {
  const optionIds: string[] = [];
  const optionsRef = ref(database, "options");
  for (const option of vote.options!) {
    const newOptionRef = push(optionsRef);
    optionIds.push(newOptionRef.key!);
    await set(newOptionRef, {
      label: option,
    });
  }

  const newVoteRef = push(ref(database, "votes"));
  await set(newVoteRef, {
    name: vote.name,
    creationDate: vote.creationDate.getTime(),
    status: vote.status,
    type: vote.type,
    creator: authStore.user!.uid,
  });
  for (const optionId of optionIds) {
    await set(
      ref(database, `votes/${newVoteRef.key}/options/${optionId}`),
      true
    );
  }
  for (const memberId of vote.members!) {
    await set(
      ref(database, `votes/${newVoteRef.key}/members/${memberId}`),
      true
    );
  }

  return set(
    ref(database, `users/${authStore.user!.uid}/votes/${newVoteRef.key}`),
    true
  );
};

export const updateVote = async (vote: Vote) => {
  const voteRef = ref(database, `votes/${vote.id}`);
  return update(voteRef, {
    name: vote.name,
    creationDate: vote.creationDate.getTime(),
    status: vote.status,
    type: vote.type,
  });
};

export const getVote = async (voteId: string) => {
  let vote: Vote = {
    name: "",
    creationDate: new Date(),
    status: STATUS.CREATED,
    type: TYPE.SINGLE,
  };
  await get(ref(database, `votes/${voteId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      const snapshotVal = snapshot.val();
      vote = {
        id: voteId,
        name: snapshotVal.name,
        creationDate: snapshotVal.creationDate,
        status: snapshotVal.status as STATUS,
        type: snapshotVal.type as TYPE,
        options: snapshotVal.options,
        members: snapshotVal.members,
      };
    }
  });
  return vote;
};

export const setStatus = async (voteId: string, status: STATUS) => {
  const voteRef = ref(database, `votes/${voteId}`);
  return update(voteRef, {
    status: status,
  });
};

export const deleteVote = async (voteId: string) => {
  remove(ref(database, `users/${authStore.user!.uid}/votes/${voteId}`)).then(
    () => {
      const voteRef = ref(database, `votes/${voteId}`);
      get(child(voteRef, "options")).then((snapshot) => {
        if (snapshot.exists()) {
          Object.keys(snapshot.val()).forEach((optionId) => {
            remove(ref(database, `options/${optionId}`));
          });
          return remove(voteRef);
        }
      });
    }
  );
};

export const createMember = async (member: Member) => {
  const newMemberRef = push(ref(database, "members"));
  await set(newMemberRef, {
    firstName: member.firstName,
    lastName: member.lastName,
  });

  return set(
    ref(database, `users/${authStore.user!.uid}/members/${newMemberRef.key}`),
    true
  );
};

export const deleteMember = async (memberId: string) => {
  remove(
    ref(database, `users/${authStore.user!.uid}/members/${memberId}`)
  ).then(() => {
    return remove(ref(database, `members/${memberId}`));
  });
};

export const getOptions = async (optionIds: string[]) => {
  const options: Option[] = [];
  for (const optionId of optionIds) {
    await get(ref(database, `options/${optionId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const newOption: Option = {
          id: optionId,
          label: snapshot.val().label,
        };
        options.push(newOption);
      }
    });
  }
  return options;
};

export const submitOption = async (
  voter: string,
  voteId: string,
  options: string[]
) => {
  const votedForRef = ref(database, `members/${voter}/votedFor/${voteId}`);
  await get(votedForRef).then(async (snapshot) => {
    if (!snapshot.exists()) {
      for (const optionId of options) {
        await set(votedForRef, true);
        await set(ref(database, `options/${optionId}/nrOfVotes`), increment(1));
      }
      await set(ref(database, `votes/${voteId}/totalNrOfVotes`), increment(1));
    } else {
      throw new Error("This person has already voted.");
    }
  });
};

export const getUserMembers = async () => {
  let members: string[] = [];
  await get(ref(database, `users/${authStore.user?.uid}/members`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        members = Object.keys(snapshot.val());
      }
    }
  );
  return members;
};
