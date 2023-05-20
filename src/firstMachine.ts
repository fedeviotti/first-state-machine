import {createMachine, assign, StateFrom} from 'xstate';

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
          actions: ['consoleLogId']
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
            userId: (state, _) => state.userId
          })
        }
      }
    }
  }
}, {
  services: {
    fetchUser: async () => {
      return {
        name: 'John Doe',
      };
    },
  },
  actions: {
    consoleLogId: (_, event) => {
      console.log(event.data.name);
    },
  },
});

export type FirstMachineState = StateFrom<typeof firstMachine>;
