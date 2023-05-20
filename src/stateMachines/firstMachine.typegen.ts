// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.fetch.loading:invocation[0]": {
      type: "done.invoke.fetch.loading:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchUser: "done.invoke.fetch.loading:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    updateUserDetails: "done.invoke.fetch.loading:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    fetchUser: "RETRY" | "SUBMIT";
  };
  matchesStates: "failure" | "idle" | "loading" | "success";
  tags: never;
}
