import { push, ref, set } from "firebase/database";

import { database } from "@/configs/firebase";
import type { Vote } from "@/common/interfaces";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

export const createVote = async (vote: Vote) => {
  if (authStore.user?.uid) {
    const votesRef = ref(database, `users/${authStore.user.uid}/votes`);
    const newVoteRef = push(votesRef);
    return set(newVoteRef, {
      name: vote.name,
      creationDate: vote.creationDate.getTime(),
      status: vote.status,
      type: vote.type,
    }).then((response) => {
      console.log(response, newVoteRef.key);
    });

    // TODO push options
  }
};
