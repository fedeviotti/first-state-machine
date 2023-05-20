import {createMachine, assign, StateFrom} from 'xstate';

const fetchUser = (userId: number) =>
  fetch(`https://swapi.dev/api/people/${userId}`).then(async (response) => {
    const data = await response.json()
    return { userDetails: { ...data }}
  });

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
          actions: assign({
            userId: (_, event) => event.userId
          })
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
          actions: assign({
            userId: (state) => state.userId
          })
        }
      }
    }
  }
}, {
  services: {
    fetchUser: (context) => fetchUser(context.userId)
  },
  actions: {
    updateUserDetails: assign({
      userDetails: (_, event) => event.data.userDetails
    }),
  },
});

export type FirstMachineState = StateFrom<typeof firstMachine>;
