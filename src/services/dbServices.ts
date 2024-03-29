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

  if (vote.status === STATUS.ACTIVE) {
    setSequence(newVoteRef.key!);
  }

  return set(
    ref(database, `users/${authStore.user!.uid}/votes/${newVoteRef.key}`),
    true
  );
};

export const updateVote = async (vote: Vote) => {
  if (vote.status === STATUS.ACTIVE) {
    setSequence(vote.id!);
  }
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

const generateUniqueSequence = (
  existingValues: Array<number> | undefined
): number => {
  let uniqueSequence = Math.floor(100000 + Math.random() * 900000);
  existingValues?.forEach((sequence) => {
    if (uniqueSequence === sequence) {
      uniqueSequence = generateUniqueSequence(existingValues);
    }
  });
  return uniqueSequence;
};

const setSequence = async (voteId: string) => {
  const newLinkRef = ref(database, `links/${voteId}`);
  get(ref(database, "links")).then((snapshot) => {
    const uniqueSequence = generateUniqueSequence(
      snapshot.exists() ? Object.values(snapshot.val()) : undefined
    );
    set(newLinkRef, uniqueSequence);
  });
};

export const setStatus = async (voteId: string, status: STATUS) => {
  if (status === STATUS.ACTIVE) {
    setSequence(voteId);
  } else {
    remove(ref(database, `links/${voteId}`));
  }

  const voteRef = ref(database, `votes/${voteId}`);
  return update(voteRef, {
    status: status,
  });
};

export const getSequence = async (voteId: string): Promise<number> => {
  let sequence = 0;
  await get(ref(database, `links/${voteId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      sequence = snapshot.val() as number;
    }
  });
  return sequence;
};

export const getVoteId = async (voteSequence: number): Promise<string> => {
  let voteId = "";
  await get(ref(database, "links")).then((snapshot) => {
    const ids = snapshot.exists() ? Object.keys(snapshot.val()) : undefined;
    voteId = ids?.find((id) => snapshot.val()[id] === voteSequence) || "";
  });
  return voteId;
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
  remove(ref(database, `links/${voteId}`));
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

export const getVoteOptions = async (voteId: string) => {
  let options: string[] = [];
  await get(ref(database, `votes/${voteId}/options`)).then((snapshot) => {
    if (snapshot.exists()) {
      options = Object.keys(snapshot.val());
    }
  });
  return options;
};

export const getTotalNrOfVotes = async (voteId: string) => {
  let totalNrOfVotes = 0;
  await get(ref(database, `votes/${voteId}/totalNrOfVotes`)).then(
    (snapshot) => {
      if (snapshot.exists()) {
        totalNrOfVotes = snapshot.val();
      }
    }
  );
  return totalNrOfVotes;
};

export const getOptions = async (optionIds: string[]) => {
  const options: Option[] = [];
  for (const optionId of optionIds) {
    await get(ref(database, `options/${optionId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const newOption: Option = {
          id: optionId,
          label: snapshot.val().label,
          nrOfVotes: snapshot.val().nrOfVotes,
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
