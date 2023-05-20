import { useSelector} from "@xstate/react";
import { FirstMachineState} from "./stateMachines/firstMachine";
import {useContext} from "react";
import {GlobalStateContext} from "./GlobalStateProvider";
import {Box, Button, Input, Stack, Text} from "@chakra-ui/react";

const idleSelector = (state: FirstMachineState) => state.matches("idle");
const loadingSelector = (state: FirstMachineState) => state.matches("loading");
const successSelector = (state: FirstMachineState) => state.matches("success");
const userIdSelector = (state: FirstMachineState) => state.context.userId;
const userDetailsSelector = (state: FirstMachineState) => state.context.userDetails;

export const Home = () => {
  const globalServices = useContext(GlobalStateContext);
  const isIdle = useSelector(globalServices.firstService, idleSelector);
  const isLoading = useSelector(globalServices.firstService, loadingSelector);
  const isSuccess = useSelector(globalServices.firstService, successSelector);
  const userId = useSelector(globalServices.firstService, userIdSelector);
  const userDetails = useSelector(globalServices.firstService, userDetailsSelector);
  const { send } = globalServices.firstService;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());
    send({ type: "SUBMIT", userId: Number(formJson.userId) });
  }

  if (isIdle) {
    return (
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Stack maxW={"60%"} spacing={"24px"}>
          <form method="post" onSubmit={handleSubmit}>
            <Stack direction={"row"} spacing={"12px"}>
                <Input
                  name="userId"
                  placeholder="Insert user id"
                />
                <Button type="submit">Fetch data</Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    );
  }

  if (isLoading) {
    return (<Box>Loading...</Box>);
  }

  if (isSuccess) {
    return (
      <Box>
        <Text>User id: {userId}</Text>
        <Text>User details</Text>
        <Text>Name: {userDetails.name}</Text>
        <Text>Gender: {userDetails.gender}</Text>
      </Box>
    )
  }

  // TODO: on error display a component that shows a button to retry

  return (
    <Box>
      <Text>Something went wrong</Text>
    </Box>
  );
}
