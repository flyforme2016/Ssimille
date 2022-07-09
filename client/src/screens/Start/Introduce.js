import React, {useRef, useState, useEffect} from 'react';
import {OnboardingDatas} from '../../const/datas';
import styled from 'styled-components/native';
import {IconControlBtn} from '../../components/CustomButtons';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const Introduce = ({navigation: {replace}}) => {
  const flatlistRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewableItems, setViewableItems] = useState([]);

  const handleViewableItemsChanged = useRef(({viewableItems}) => {
    setViewableItems(viewableItems);
  });

  useEffect(() => {
    if (!viewableItems[0] || currentPage === viewableItems[0].index) {
      return;
    }
    setCurrentPage(viewableItems[0].index);
  }, [currentPage, viewableItems]);

  const handlePages = index => {
    flatlistRef.current.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  return (
    <Container>
      <Header currentPage={currentPage}>
        <IconControlBtn
          onPress={() => {
            handlePages(OnboardingDatas.length - 1);
          }}
          text="Skip"
        />
      </Header>
      <FlatList
        data={OnboardingDatas}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        ref={flatlistRef}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
        initialNumToRender={1}
        renderItem={({item}) => {
          return (
            <PageContainer>
              <BackgroungImg width={width} source={item.img} />
              <TextWrapper width={width}>
                <Title>{item.title}</Title>
                <SubTitle>{item.description}</SubTitle>
              </TextWrapper>
            </PageContainer>
          );
        }}
      />
      <Footer>
        <BackOpacity currentPage={currentPage}>
          <IconControlBtn
            onPress={() => {
              currentPage === 0 ? null : handlePages(currentPage - 1);
            }}
            type="arrow-back-circle-outline"
            size={40}
          />
        </BackOpacity>

        {currentPage !== OnboardingDatas.length - 1 ? (
          <IconControlBtn
            onPress={() =>
              currentPage === OnboardingDatas.length - 1
                ? null
                : handlePages(currentPage + 1)
            }
            type="arrow-forward-circle-outline"
            size={40}
          />
        ) : (
          <Getstart
            onPress={() => {
              replace('Stack', {screen: 'Myzone'});
            }}>
            <BtnText>시작하기</BtnText>
          </Getstart>
        )}
      </Footer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;
const Header = styled.View`
  margin-right: 5px;
  flex-direction: row;
  justify-content: flex-end;
  opacity: ${props =>
    props.currentPage === OnboardingDatas.length - 1 ? 0 : 1};
`;
const BackOpacity = styled.View`
  opacity: ${props => (props.currentPage === 0 ? 0 : 1)};
`;
const FlatList = styled.FlatList``;
const PageContainer = styled.View`
  align-items: center;
  justify-content: center;
`;
const BackgroungImg = styled.ImageBackground`
  width: ${({width}) => width};
  height: ${({width}) => width};
`;
const TextWrapper = styled.View`
  width: ${({width}) => width - 20};
  align-items: center;
`;
const Title = styled.Text`
  font-size: 25;
  text-align: center;
  font-weight: bold;
  color: black;
`;
const SubTitle = styled.Text`
  font-size: 18;
  text-align: center;
  margin-top: 15;
  color: #9b59b6;
`;

const Footer = styled.View`
  margin: 0 5px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;
const BtnText = styled.Text`
  color: white;
  font-size: 14;
`;
const Getstart = styled.TouchableOpacity`
  border-radius: 15px;
  padding: 10px;
  background-color: #9b59b6;
`;

export default Introduce;
