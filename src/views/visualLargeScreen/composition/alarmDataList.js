import { ref, onBeforeMount } from 'vue';
import { getTheLatestAlarms } from '/@/api/visualLargeScreen/index.js';

export default function (){
    const alarmDataList =  ref([]);


    onBeforeMount(async ()=>{
         const res = await getTheLatestAlarms();
         alarmDataList.value = res.data.result;
    });


    return {
        alarmDataList
    }
}