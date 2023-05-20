import {createContext, PropsWithChildren} from 'react';
import { useInterpret } from '@xstate/react';
import { firstMachine } from './stateMachines/firstMachine';
import {InterpreterFrom} from "xstate";

export const GlobalStateContext = createContext({ firstService: {} as InterpreterFrom<typeof firstMachine> });

export const GlobalStateProvider = (props: PropsWithChildren) => {
  const firstService = useInterpret(firstMachine);

  return (
    <GlobalStateContext.Provider value={{ firstService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};
