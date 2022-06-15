import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {COLORS, SIZES} from '../../components/index';
import {OnboardingDatas} from '../../datas';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';

const Onboarding = ({navigation: {navigate}, route}) => {
  const flatlistRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewableItems, setViewableItems] = useState([]);
  console.log('route: ', route)

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    setViewableItems(viewableItems);
  });
  useEffect(() => {
    if (!viewableItems[0] || currentPage === viewableItems[0].index) return;
    setCurrentPage(viewableItems[0].index);
  }, [currentPage, viewableItems]);

  const handleNext = () => {
    if (currentPage === OnboardingDatas.length - 1) return;

    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage + 1,
    });
    console.log('click');
  };

  const handleBack = () => {
    if (currentPage == 0) return;
    flatlistRef.current.scrollToIndex({
      animated: true,
      index: currentPage - 1,
    });
  };

  const handleSkipToEnd = () => {
    flatlistRef.current.scrollToIndex({
      animate: true,
      index: OnboardingDatas.length - 1,
    });
  };

  const renderTopSection = () => {
    return (
      <SafeAreaView>
        <Container>
          {/* Back button */}
          <TouchableOpacity onPress={handleBack}>
            {/* Back icon */}
            {/* Hide back button on 1st screen */}
            <AntDesignIcons
              name="left"
              style={{
                fontSize: 25,
                color: COLORS.black,
                opacity: currentPage == 0 ? 0 : 1,
              }}
            />
          </TouchableOpacity>
          {/* Skip button */}
          {/* Hide Skip button on last screen */}
          <TouchableOpacity onPress={handleSkipToEnd}>
            <Text
              style={{
                fontSize: 18,
                color: COLORS.black,
                opacity: currentPage == OnboardingDatas.length - 1 ? 0 : 1,
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </Container>
      </SafeAreaView>
    );
  };

  const renderBottomSection = () => {
    return (
      <SafeAreaView>
        <Container>
          {/* Pagination */}
          <Pagview>
            {
              // No. of dots
              [...Array(OnboardingDatas.length)].map((_, index) => (
                <View key={index} />
              ))
            }
          </Pagview>

          {/* Next or GetStarted button */}
          {/* Show or Hide Next button & GetStarted button by screen */}
          {currentPage != OnboardingDatas.length - 1 ? (
            <Next onPress={handleNext} activeOpacity={0.8}>
              <AntDesignIcons
                name="right"
                style={{fontSize: 18, color: COLORS.white, opacity: 0.3}}
              />
              <AntDesignIcons
                name="right"
                style={{fontSize: 25, color: COLORS.white, marginLeft: -15}}
              />
            </Next>
          ) : (
            // Get Started Button
            <Getstart
              onPress={() => {
                navigate('Stack', {screen: 'KakaoLogin'});
              }}>
              <NavText>Get Started</NavText>
              <AntDesignIcons
                name="right"
                style={{
                  fontSize: 18,
                  color: COLORS.white,
                  opacity: 0.3,
                  marginLeft: SIZES.base,
                }}
              />
              <AntDesignIcons
                name="right"
                style={{fontSize: 25, color: COLORS.white, marginLeft: -15}}
              />
            </Getstart>
          )}
        </Container>
      </SafeAreaView>
    );
  };

  const renderFlatlistItem = ({item}) => {
    return (
      <View
        style={{
          width: SIZES.width,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <NavBar>
          <FLATLIST source={item.img} />
        </NavBar>
        <NavBar1>
          <NavText1>{item.title}</NavText1>
          <NavText2>{item.description}</NavText2>
        </NavBar1>
      </View>
    );
  };

  return (
    <Container1>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* TOP SECTION - Back & Skip button */}
      {renderTopSection()}

      {/* FLATLIST with pages */}
      <FlatList
        data={OnboardingDatas}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={renderFlatlistItem}
        ref={flatlistRef}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
        initialNumToRender={1}
        extraData={SIZES.width}
      />

      {/* BOTTOM SECTION - pagination & next or GetStarted button */}
      {renderBottomSection()}
    </Container1>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20;
  padding-vertical: 20;
`;
const Container1 = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;
const NavBar = styled.View`
  align-items: center;
  margin-vertical: 20;
`;
const NavBar1 = styled.View`
  padding-horizontal: 40;
  margin-vertical: 40;
`;
const Next = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 60;
  height: 60;
  border-radius: 30;
  background-color: #9b59b6;
`;
const Getstart = styled.TouchableOpacity`
  padding-horizontal: 20;
  height: 60;
  border-radius: 30;
  background-color: #9b59b6;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Pagview = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NavText = styled.Text`
  color: white;
  font-size: 18;
  margin-left: 10;
`;

const NavText1 = styled.Text`
  font-size: 33;
  text-align: center;
  font-weight: bold;
  color: black;
`;

const NavText2 = styled.Text`
  font-size: 15;
  opacity: 1.5;
  text-align: center;
  margin-top: 15;
  line-height: 28;
  color: #9b59b6;
`;

const FLATLIST = styled.ImageBackground`
  width: 335;
  height: 335;
  resize-mode: contains;
`;
export default Onboarding;
