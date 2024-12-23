import { Text, TouchableOpacity, View } from "react-native";

function Home({navigation}){
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity style={{borderColor:'black'}} onPress={()=>{navigation.navigate('HomePage')}}>
        <Text style={{color:'black'}}>
        Move Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export default Home;