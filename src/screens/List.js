import {Animated, Text, TouchableOpacity, View,FlatList, SafeAreaView, Pressable, Platform} from 'react-native';
import { useContext, useEffect, useRef, } from 'react';
import { updateData, deleteTask, clearData } from '../../functions';
import { Ionicons } from '@expo/vector-icons';
import GlobalContext from '../../GlobalContext';
import { darkTheme, lightTheme } from '../../theme';

const List = ({ navigation }) => {
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
            <Text className={`text-center ${theme.textColor} text-2xl font-bold`}
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

  export default List;