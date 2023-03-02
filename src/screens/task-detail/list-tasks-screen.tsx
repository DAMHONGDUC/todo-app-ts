import {useRoute, useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  TaskDetailScreenRouteProp,
  MainStackNavigationProp,
} from 'navigation/types';
import {COLORS} from 'constant/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskRow from 'screens/task-detail/task-row';
import {ITask} from 'services/task/task-model';
import SelectDropdown from 'react-native-select-dropdown';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'redux/store';
import {
  deleteTaskAction,
  getTaskByCategoryIdAction,
} from 'redux/slices/task-slice';
import LoadingComponent from 'components/loading-component';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const options: string[] = ['Done', 'Progress', 'All'];
const defaultOption = 2;

type Props = {
  item: ITask;
  index: number;
};

export default function ListTasksScreen(): JSX.Element {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const {categoryId, categoryName} = route.params;
  const navigation = useNavigation<MainStackNavigationProp>();
  const [option, setOption] = useState(defaultOption);
  const [showingData, setShowingData] = useState([]);
  const dispatch = useAppDispatch();
  const {tasks, isLoading} = useAppSelector(state => state.task);

  const handleBackButton = () => {
    navigation.pop();
  };

  useEffect(() => {
    const fetchAllCategory = async () => {
      await dispatch(getTaskByCategoryIdAction({categoryId: categoryId}));
    };

    fetchAllCategory();
  }, [dispatch, categoryId]);

  useEffect(() => {
    tasks &&
      setShowingData(
        option === defaultOption
          ? tasks
          : tasks.filter(e => e.status === options[option]),
      );
  }, [option, tasks]);

  const renderItem = ({item}: Props) => {
    return <TaskRow data={item}></TaskRow>;
  };

  const deleteRow = (id: string) => {
    dispatch(deleteTaskAction({id: id}));
  };

  const renderHiddenItem = (rowData, rowMap) => {
    return (
      <View style={styles.rowBack}>
        {/* <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => closeRow(props.index)}>
          <Ionicons name={'close'} color={'#6aa84f'} size={33}></Ionicons>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(rowData.item.id)}>
          <MaterialCommunityIcons
            name={'delete'}
            color={COLORS.primary}
            size={30}></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButton}>
          <Ionicons name="arrow-back" color={COLORS.black} size={25} />
        </TouchableOpacity>

        <Text style={styles.mainTitle}>{categoryName} tasks</Text>
      </View>
      <View style={styles.dropDown}>
        <SelectDropdown
          data={options}
          onSelect={(selectedItem, index) => {
            setOption(index);
          }}
          defaultValue={options[defaultOption]}
          rowStyle={styles.rowStyle}
          rowTextStyle={styles.rowTextStyle}
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
        />
      </View>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        // <FlatList
        //   data={showingData}
        //   renderItem={renderItem}
        //   keyExtractor={item => item.id.toString()}
        //   ListEmptyComponent={
        //     <Text style={styles.notiText}>{'You have no task'}</Text>
        //   }></FlatList>
        <View style={styles.container2}>
          <SwipeListView
            data={showingData}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={0}
            // rightOpenValue={-100}
            rightOpenValue={-60}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            ListEmptyComponent={
              <Text style={styles.notiText}>{'You have no task'}</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 20,
  },
  container2: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainTitle: {
    color: COLORS.black,
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
  },
  notiText: {
    color: COLORS.primary,
  },
  rowStyle: {backgroundColor: COLORS.white},
  rowTextStyle: {fontSize: 14},
  buttonStyle: {
    width: 150,
    borderColor: COLORS.black,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  buttonTextStyle: {fontSize: 14},
  dropDown: {marginBottom: 15, marginTop: 20},
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    borderRadius: 10,
  },
  backRightBtnLeft: {
    right: 60,
  },
  backRightBtnRight: {
    right: 10,
  },
});
