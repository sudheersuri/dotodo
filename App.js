import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {Animated, Text, TouchableOpacity, View, TextInput, FlatList, SafeAreaView, KeyboardAvoidingView, Pressable, Platform, StyleSheet} from 'react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import { getData, addNewTask, updateData, deleteTask, clearData } from './functions';
import { Ionicons } from '@expo/vector-icons';
import GlobalContext from './GlobalContext';
import { 
   useFonts,
   Montserrat_400Regular,
   Montserrat_700Bold,
   Montserrat_900Black,
 } from '@expo-google-fonts/montserrat';
import { useColorScheme} from 'react-native';

  // Define your light and dark theme objects
  const lightTheme = {
    mode:'light',
    backgroundColor: '#F3F3F3',
    textColor: 'text-black',
    moonColor:'#888888',
    listItemBackgroundColor:'#FFFFFF',
    taskNameColor:'#000000',
    doneBackgroundColor:'#CEE5D4'
    // ... other light theme styles
  };

  const darkTheme = {
    mode:'dark',
    backgroundColor: 'black',
    textColor: 'text-white',
    moonColor:'#FDF7D3',
    listItemBackgroundColor:'#111111',
    taskNameColor:'#FFFFFF',
    doneBackgroundColor:'#102716'
    // ... other dark theme styles
  };


const Stack = createStackNavigator(); 

const ListScreen = ({ navigation }) => {
  const {globals,setGlobals}= useContext(GlobalContext);
  
  const {tasks,theme} = globals;
  const animation = useRef(new Animated.Value(0)).current;
  const listanimation = useRef(new Animated.Value(0)).current;
  const clearlistanimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animation,{
      toValue:1,
      duration:500,
      useNativeDriver:true
    }).start();
    Animated.timing(listanimation,{
      toValue:1,
      duration:1000,
      useNativeDriver:true,
    }).start();
  }, []);
  
    // useEffect(() => {
  //   clearData().then(() => {
  //     setGlobals({...globals,tasks:[]});
  //   });
  // }, []);

  const opacityAnimation = animation.interpolate({
    inputRange:[0,1],
    outputRange:[0,-105]
  });
  const listItemAnimation = listanimation.interpolate({
    inputRange:[0,1],
    outputRange:[1000,0]
  });

  return (
    <SafeAreaView className={`h-full  relative ${Platform.OS!=='ios'?'pt-12':''}`} style={{backgroundColor:theme.backgroundColor}}>
      <View className="flex-row justify-between mx-3 items-center">
          <Text className={`text-center ${theme.textColor}  text-2xl font-bold`}
                style={{fontFamily: 'Montserrat_700Bold'}}>Dotodo
          </Text>
          <View className="flex-row">
          <Pressable  onPress={() => 
            setGlobals({...globals,theme: globals.theme.mode==='light' ? darkTheme : lightTheme})
          } className="pr-2">
            <Ionicons name="moon" size={22} color={theme.moonColor} />
          </Pressable>
          <Pressable  onPress={() => clearData().then((res)=>{
           tasks.length && setGlobals({...globals,tasks:[]});
          })} className="pr-2">
            <Ionicons name="remove-circle-outline" size={24} color="#FF7474" />
          </Pressable>
          </View>
      </View>

      {tasks.length === 0 ? (
        <View className="flex-1 h-100 justify-center items-center">
          <Text className='text-gray-400'>No todos</Text>
        </View>
      ) : (
        <FlatList
        className="mt-4"
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Animated.View style={{transform:
              [{
                translateY:listItemAnimation
              }]
          }}>
            <Pressable
              className={`flex-row mx-3 my-1 p-3 border-radius-5 rounded-lg`}
              style={{backgroundColor:item.done ? theme.doneBackgroundColor : theme.listItemBackgroundColor}}
              onPress={() => {
                updateData(item.uid,!item.done).then((data)=>{ 
                      setGlobals({...globals,tasks:data});
                }
                );
              }}
            >
                <View className="flex-row h-100" style={{flex:9}}>
                    <Ionicons name="checkmark-circle" size={25} color={!item.done?'#D4D4D4':'#449C5A'}/>
                    <Text className="pl-1 mt-1 pr-1" style={{fontFamily: 'Montserrat_400Regular',color:theme.taskNameColor}}>{item.name}</Text>
                </View>
                <Pressable className=" h-100 items-end mt-1" style={{flex:1}} onPress={()=>
                  deleteTask(item.uid).then((data)=>{
                    setGlobals({...globals,tasks:data});
                    })}
                  >
                      <Ionicons name="trash-outline" size={15} color="#FF7474" />
                </Pressable>
            </Pressable>
            </Animated.View>
          )}
        />
      )}
     <Animated.View style={{transform:
        [{
          translateY:opacityAnimation
        }]
    }}>
       <TouchableOpacity
        style={
          {
            position: 'absolute',
            borderRadius: 999,
            backgroundColor: '#4385F5',
            width: 64,
            height: 64,
            bottom: -100,
            right: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }
        onPress={() => navigation.navigate('Create')}
      >
        <Ionicons name="add" size={24} color="white"/>
      </TouchableOpacity>
      </Animated.View>
     
      
    </SafeAreaView>
  );
};

const CreateScreen = ({ navigation }) => {
  
  const [name, setname] = useState('');
  const {globals,setGlobals}= useContext(GlobalContext);
 
  const {theme} = globals;

  const handleCancel = () => {
    navigation.navigate('List');
  };

  const handleSave = () => {

    if(name === '')
    {
      navigation.navigate('List');
      return
    }
    const uid = Math.random().toString(36).substring(7);
    addNewTask({uid,name:name.trim(),done:false}).then(
      ()=>{
        getData().then((data) => {
          if(data)
            setGlobals({...globals,tasks:JSON.parse(data)});
          navigation.navigate('List');
        });
      }
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${theme.textColor} ${Platform.OS!=='ios'?'pt-8':''}`}
    style={{backgroundColor:theme.backgroundColor}}
    >
      <View className="flex-row justify-between mx-3 items-center">
      <Text
        className={`font-bold text-lg text-center py-3 ${theme.textColor}`}
        style={{fontFamily: 'Montserrat_400Regular'}}
        onPress={() => navigation.navigate('List')}
      >
        Add New
      </Text>
      <Pressable  onPress={() => 
            setGlobals({...globals,theme: globals.theme.mode==='light' ? darkTheme : lightTheme})
          } className="pr-2">
            <Ionicons name="moon" size={22} color={theme.moonColor} />
      </Pressable>
      </View>
     
      <TextInput
        
        value={name}
        onChangeText={setname}
        placeholder="Enter task name"
        multiline={true}
        underlineColorAndroid='transparent'
        autoFocus={true}
        style={{
         textAlignVertical: 'top',
        }}
        className={`px-3 flex-1 ${theme.textColor}`}
      />
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-row justify-end w-100 px-5 gap-3 mb-3">
          <TouchableOpacity
            className="flex-row align-center rounded-full bg-gray-200 border-radius-5 p-5"
            onPress={handleCancel}
          >
            <Ionicons name='close-outline' size={24} color={'#000'} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row align-center rounded-full bg-green-600 border-radius-5 p-5"
            onPress={handleSave}
          >
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
     
    </SafeAreaView>
  );
};

function MyStack() {
  return (
    <Stack.Navigator  screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Create" component={CreateScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  

  const colorScheme = useColorScheme();


  // Choose the theme based on device appearance
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const [globals,setGlobals]= useState({tasks:[],theme:theme});

  useEffect(() => {
    getData().then((data) => {
      if(data)
      {
        try{
          setGlobals({...globals,tasks:JSON.parse(data)});
        }
        catch(e){
          console.log(e);
        }
      }
    });
  }, []);
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black
  });
  if (!fontsLoaded) {
    return <Text>Hi</Text>;
  }
  return (
    
        <GlobalContext.Provider value={{globals,setGlobals}}>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
        </GlobalContext.Provider>
    
  );
}


const styles = StyleSheet.create({
  
});