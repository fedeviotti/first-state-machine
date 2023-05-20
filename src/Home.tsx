import { useSelector} from "@xstate/react";
import { FirstMachineState} from "./firstMachine";
import {useContext} from "react";
import {GlobalStateContext} from "./GlobalStateProvider";
import {Box, Button, Input, Stack, Text} from "@chakra-ui/react";

const idleSelector = (state: FirstMachineState) => state.matches("idle");
const loadingSelector = (state: FirstMachineState) => state.matches("loading");

export const Home = () => {
  const globalServices = useContext(GlobalStateContext);
  const isIdle = useSelector(globalServices.firstService, idleSelector);
  const isLoading = useSelector(globalServices.firstService, loadingSelector);
  const userId = useSelector(globalServices.firstService, (state) => state.context.userId);
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
    return (<Box>Loading...{userId}</Box>);
  }

  return (
    <Box>
    <Text>{userId}</Text>
    <Text>User details</Text>
    </Box>
  );
}
