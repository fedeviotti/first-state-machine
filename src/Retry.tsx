import { Button} from "@chakra-ui/react";
import {FirstMachineState, useFirstMachine} from "./stateMachines/firstMachine";
import {useSelector} from "@xstate/react";

const userIdSelector = (state: FirstMachineState) => state.context.userId;

export const Retry = () => {
  const firstMachine = useFirstMachine();
  const userId = useSelector(firstMachine, userIdSelector);

  return (
    <Button onClick={() => firstMachine.send({ type: "RETRY" })}>Retry {userId}</Button>
  );
}
