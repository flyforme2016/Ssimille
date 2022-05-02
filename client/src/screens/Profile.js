/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';

const MORE = {
  uri: 'data:image/png;base64,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',
  width: 30,
  height: 30,
};
const AVARTA = {
  uri: 'data:image/png;base64,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',
  width: 70,
  height: 70,
};
const LIKE = {
  uri: 'https://cdn1.iconfinder.com/data/icons/basic-ui-element-2-2-line/512/Basic_UI_Elements_-_2.1_-_line-22-128.png',
  width: 20,
  height: 20,
};
const COMMENTS = {
  uri: 'https://cdn4.iconfinder.com/data/icons/network-and-communication-2-10/48/78-128.png',
  width: 20,
  height: 20,
};

const Stats = ({count, item}) => {
  return (
    <StatBox>
      <Text>{count}</Text>
      <Text>{item}</Text>
    </StatBox>
  );
};

const Profile = ({navigation: {navigate}}) => {
  return (
    <Container>
      <NavBar>
        <NavText>PROFILE</NavText>
        <Setting onPress={() => navigate('Stack', {screen: 'ProfileEdit'})}>
          <Image source={MORE} />
        </Setting>
      </NavBar>

      <ProfileView>
        <ProfilePic source={AVARTA} />
        <ProfileText>사용자이름</ProfileText>
        <ProfileText>노래이름</ProfileText>
        <ProfileText>한줄소개글</ProfileText>
      </ProfileView>

      <StatsBox>
        <Stats count="게시글" item="2개" />
        <StatDiff />
        <Stats count="친구" item="14명" />
        <StatDiff />
        <Stats count="애청곡" item="24곡" />
      </StatsBox>

      <CardView>
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
      </CardView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 2px solid #9b59b6;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 8px;
  position: relative;
  left: 50px;
`;

const Image = styled.Image`
  width: 30;
  height: 30;
`;
const Text = styled.Text`
  font-size: 16;
`;

const Setting = styled.TouchableOpacity`
  width: 100;
  background-color: white;
  position: relative;
  left: 160px;
`;

const ProfileView = styled.View`
  padding: 12px;
  align-items: center;
`;

const ProfilePic = styled.Image`
  padding: 15px;
  margin: 10px;
`;

const ProfileText = styled.Text`
  font-size: 16;
  padding: 5px;
`;

const StatsBox = styled.View`
  padding-bottom: 12px;
  margin: 0 11px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatBox = styled.View`
  margin: 1px 25px;
  align-items: center;
`;

const StatDiff = styled.View`
  width: 2;
  height: 30;
  background-color: #9b59b6;
`;

const CardView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    alignItems: 'center',
  },
}))``;

const Card = styled.View`
  width: 250;
  height: 150;
  margin: 10px;
  padding: 10px;
  background-color: #b7b4df;
  flex-direction: row;
  justify-content: space-between;
`;

export default Profile;