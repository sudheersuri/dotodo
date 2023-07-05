
import { Text, TouchableOpacity, View, TextInput,  SafeAreaView, KeyboardAvoidingView, Pressable, Platform } from 'react-native';
import { useContext, useState } from 'react';
import { getData, addNewTask  } from '../../functions';
import { Ionicons } from '@expo/vector-icons';
import GlobalContext from '../../GlobalContext';
import { darkTheme, lightTheme } from '../../theme';

const Create = ({ navigation }) => {
  
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
      <SafeAreaView className={`flex-1 ${Platform.OS!=='ios'?'pt-8':''}`}
      style={{backgroundColor:theme.createBackgroundColor}}
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

export default Create;