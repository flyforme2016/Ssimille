import * as React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import styled from 'styled-components/native';
const itemIds = [
  {id: 0, name: '펑키'},
  {id: 1, name: '발라드'},
  {id: 2, name: '랩'},
  {id: 3, name: '팝송'},
  {id: 4, name: '재즈'},
  {id: 5, name: '포크'},
  {id: 6, name: '디스코'},
  {id: 7, name: '트로트'},
  {id: 8, name: '댄스'},
  {id: 9, name: 'EDM'},
  {id: 10, name: '클래식'},
  {id: 11, name: '락&롤'},
  {id: 12, name: '블루스'},
  {id: 13, name: '컨트리'},
  {id: 14, name: '레게'},
  {id: 15, name: 'k-pop'},
  {id: 16, name: 'j-pop'},
  {id: 17, name: 'R&B'},
  {id: 18, name: '오페라'},
  {id: 19, name: '인디'},
  {id: 20, name: '교향곡'},
  {id: 21, name: '메탈'},
  {id: 22, name: '샹송'},
  {id: 23, name: '성악'},
];

export default function App() {
  const [idx, setIdx] = React.useState([]);
  console.log(idx);
  return (
    <View style={styles.container}>
      {itemIds.map(data => {
        const isSelected = idx.includes(data);
        return (
          <Pressable
            onPress={() => {
              setIdx(([...prev]) => {
                const id = prev.indexOf(data);
                if (id > -1) prev.splice(id, 1);
                else if (idx.length > 4) alert('다섯개만 선택하세여');
                else prev.push(data);
                return prev;
              });
            }}
            style={{
              backgroundColor: isSelected ? '#b7b4df' : '#f2f2f2',
              width: 50,
              height: 40,
              alignItems: 'center',
              borderRadius: 100,
            }}>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {data.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',

    padding: 8,
  },
  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container2: {
    width: '50%',

    padding: 17,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },
});
