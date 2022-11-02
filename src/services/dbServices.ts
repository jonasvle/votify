import { push, ref, set, update } from "firebase/database";

import { database } from "@/configs/firebase";
import type { Vote } from "@/common/interfaces";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

export const createVote = async (vote: Vote) => {
  if (authStore.user?.uid) {
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
    });
    for (const optionId of optionIds) {
      await set(
        ref(database, `votes/${newVoteRef.key}/options/${optionId}`),
        true
      );
    }

    return set(
      ref(database, `users/${authStore.user.uid}/votes/${newVoteRef.key}`),
      true
    );
  }
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
