import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const EditMyPosts = ({getDeleteList, postDatas}) => {
  const [checked, setChecked] = useState([]);
  useEffect(() => {
    getDeleteList(checked);
  }, [checked]);

  return (
    <GridList>
      <Container>
        {postDatas.map(item => {
          return (
            <Post isChecked={checked.includes(item.post_seq)} width={width}>
              {item.album_image || item.image1 ? (
                <PostImg
                  width={width}
                  source={{uri: item.album_image || item.image1}}
                />
              ) : (
                <PostText>{item.input_text}</PostText>
              )}
              <CheckBox
                isChecked={checked.includes(item.post_seq)}
                onPress={() => {
                  setChecked(([...prev]) => {
                    if (checked.includes(item.post_seq)) {
                      prev.splice(prev.indexOf(item.post_seq), 1);
                    } else {
                      prev.push(item.post_seq);
                    }
                    return prev;
                  });
                }}>
                {checked.includes(item.post_seq) ? (
                  <Ionicons name="checkmark-circle" size={50} />
                ) : (
                  <Ionicons name="checkmark-circle-outline" size={50} />
                )}
              </CheckBox>
            </Post>
          );
        })}
      </Container>
    </GridList>
  );
};

const GridList = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;
const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;
const Post = styled.View`
  width: ${({width}) => (width - 5) / 3};
  height: ${({width}) => (width - 5) / 3};
  background-color: #b7b4df;
  align-items: center;
  justify-content: center;
  border: 0.5px solid #ffffff;
  opacity: ${props => (props.isChecked ? 0.9 : 0.5)};
`;

const PostText = styled.Text`
  font-size: 20px;
`;
const PostImg = styled.Image`
  width: ${({width}) => (width - 5) / 3};
  height: ${({width}) => (width - 5) / 3};
`;

const CheckBox = styled.TouchableOpacity`
  position: absolute;
  justify-content: center;
  align-items: center;
`;
export default EditMyPosts;
