import * as React from 'react';
import {createMachine, assign, StateFrom, ActorRefFrom} from 'xstate';
import {createContext} from "react";

export const firstMachine = createMachine({
  tsTypes: {} as import("./firstMachine.typegen").Typegen0,
  schema: {
    context: {} as {
      userId: number,
      userDetails: {
        name?: string,
        gender?: string,
      }
    },
    events: {} as
      | { type: 'SUBMIT', userId: number}
      | { type: 'RESOLVE'}
      | { type: 'REJECT'}
      | { type: 'RETRY'},
    services: {} as {
      fetchUser: {
        data: {
          userDetails: {
            name: string,
            gender?: string,
          },
        }
      }
    },
  },
  id: 'fetch',
  initial: 'idle',
  context: {
    userId: 0,
    userDetails: {},
  },
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'loading',
          actions: 'updateUserIdState'
        }
      }
    },
    loading: {
      invoke: {
        src: 'fetchUser',
        onDone: {
          target: 'success',
          actions: 'updateUserDetails'
        },
        onError: {
          target: 'failure'
        }
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
        }
      }
    }
  }
}, {
  actions: {
    updateUserDetails: assign({
      userDetails: (_, event) => event.data.userDetails
    }),
    updateUserIdState: assign({
      userId: (_, event) => event.userId
    })
  },
});

export type FirstMachineState = StateFrom<typeof firstMachine>;

type FirstMachineContextType = ActorRefFrom<typeof firstMachine>;
export const FirstMachineContext = createContext<FirstMachineContextType>({} as FirstMachineContextType);
export const useFirstMachine = () => React.useContext(FirstMachineContext);
