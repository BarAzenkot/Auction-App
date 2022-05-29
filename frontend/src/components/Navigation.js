import React from "react";

const Navigation = () => {
  return (
    <NavigationContainer style={styles.container}>
      <AppStack.Navigator initialRouteName="Feed">
        <AppStack.Screen
          name="Feed"
          component={Feed}
          initialParams={{
            reReadToken: reReadToken,
            signedInUser: signedInUser,
          }}
        />
        <AppStack.Screen name="Auction" component={Auction} />

        {console.log(signedInUser)}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
