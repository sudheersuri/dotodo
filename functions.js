import AsyncStorage from '@react-native-async-storage/async-storage';

const clearData = async () => {
    try {
        await AsyncStorage.clear()
    } catch (e) {
        // clear error
        console.log(e);
    }
}
const updateData = async (uid,done)=>{

  try {
    const data = await getData();
    let tasks = JSON.parse(data);
    tasks = tasks.map((task) => {
      if (task.uid === uid) {
        task.done = done;
      }
      return task;
    });
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    return tasks;
  } catch (error) {
    // Handle any errors that occur during the process
    console.log(error);
  }
}
const deleteTask = async (uid) => {
    try {
        const data = await getData();
        let tasks = JSON.parse(data);
        tasks = tasks.filter((task) => task.uid !== uid);
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
        return tasks;
    } catch (error) {
        // Handle any errors that occur during the process
        console.log(error);
    }
}

const addNewTask = async (value) => {
    
    try {
        //get the data from async storage
        const data = await AsyncStorage.getItem('tasks');
        
        //parse the data to array
        let tasks = JSON.parse(data);
        //if data is null then our array will be empty
        if (tasks === null) {
            tasks = [];
        }
        //add the task to array
        tasks.push(value);
        
        //save the array to asyncstorage
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));  
      
    } catch (e) {
      // saving error
      console.log(e);
    }
}

const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('tasks')
      if(value) {   
        // value previously stored
        return value;
      }
    } catch(e) {
      // error reading value
      
      return null;
    }

}
export { addNewTask , getData, clearData, updateData, deleteTask};