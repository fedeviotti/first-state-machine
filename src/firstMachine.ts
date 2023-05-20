import {createMachine, assign, StateFrom} from 'xstate';

const fetchUser = (userId: number) =>
  fetch(`https://swapi.dev/api/people/${userId}`).then((response) => response.json());

export const firstMachine = createMachine({
  tsTypes: {} as import("./firstMachine.typegen").Typegen0,
  schema: {
    context: {} as {
      userId: number,
      name: string,
    },
    events: {} as
      | { type: 'SUBMIT', userId: number}
      | { type: 'RESOLVE'}
      | { type: 'REJECT'}
      | { type: 'RETRY'},
    services: {} as {
      fetchUser: {
        data: {
          name: string,
        }
      }
    },
  },
  id: 'fetch',
  initial: 'idle',
  context: {
    userId: 0,
    name: '',
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
      name: (_, event) => event.data.name
    }),
  },
});

export type FirstMachineState = StateFrom<typeof firstMachine>;
