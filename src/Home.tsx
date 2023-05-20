import {useInterpret, useSelector} from "@xstate/react";
import {firstMachine, FirstMachineContext, FirstMachineState} from "./stateMachines/firstMachine";
import {Box, Button, Input, Stack, Text} from "@chakra-ui/react";
import {Retry} from "./Retry";

const fetchUser = async (userId: number) => {
  try {
    const response = await fetch(`https://swapi.dev/api/people/${userId}`);
    const data = await response.json();
    return { userDetails: { ...data }}
  } catch (e) {
    return Promise.reject(e);
  }
}

const userIdSelector = (state: FirstMachineState) => state.context.userId;
const userDetailsSelector = (state: FirstMachineState) => state.context.userDetails;

function stateSelector(state: FirstMachineState) {
  return state.value;
}

export const Home = () => {
  const firstService = useInterpret(firstMachine, {
    services: {
      fetchUser: async (context) => await fetchUser(context.userId)
    }
  });
  const userId = useSelector(firstService, userIdSelector);
  const userDetails = useSelector(firstService, userDetailsSelector);
  const state = useSelector(firstService, stateSelector);
  const { send } = firstService;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());
    send({ type: "SUBMIT", userId: Number(formJson.userId) });
  }


  const renderContent = () => {
    switch (state) {
      case "idle":
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
      case "loading":
        return (<Box>Loading...</Box>);
      case "success":
        return (
          <Box>
            <Text>User id: {userId}</Text>
            <Text>User details</Text>
            <Text>Name: {userDetails.name}</Text>
            <Text>Gender: {userDetails.gender}</Text>
          </Box>
        );
      case "failure":
        return <Retry />;
    }
  }

  return (
    <FirstMachineContext.Provider value={firstService}>
      {renderContent()}
    </FirstMachineContext.Provider>
  );
}
