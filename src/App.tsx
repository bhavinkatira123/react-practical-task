import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";

import { campaignData } from "./constants/constants";
import { IData } from "./constants/interface";

interface IndexNumberProps {
  index: number;
}

interface IRowProps {
  translateY: number;
}

const Table = styled.table`
  padding: 20px;
  width: 100%;
`;

const NameContainer = styled.td`
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out; /* Adjust transition time for smoother effect */
`;

const IndexNumber = styled.p<IndexNumberProps>`
  margin: 0;
  background-color: ${(props) => {
    switch (props.index) {
      case 0:
        return "red";
      case 1:
        return "#ff7527";
      case 2:
        return "orange";
      default:
        return "#6cbdfb";
    }
  }};
  height: 27px;
  width: 27px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  color: white;
`;

const Name = styled.p`
  margin-left: 15px;
`;

const Score = styled.td`
  color: #e33957;
  text-align: center;
  line-height: 50px;
  height: 50px;
  transition: all 0.5s ease-in-out;
`;

const Row = styled.tr<IRowProps>`
  transform: translateY(${(props) => props.translateY}px);
  transition: transform 0.5s ease-in-out;
  height: 50px;
`;

const App = (): ReactElement => {
  const [campaignDataState, setCampaignDataState] =
    useState<IData[]>(campaignData);

  useEffect(() => {
    const interval = setInterval(() => {
      applyRandomSoreToStreamers();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const applyRandomSoreToStreamers = (): void => {
    const tempCampaignDataState = campaignDataState.map((data, index) => ({
      ...data,
      originalIndex: index,
      score: getRandomScore(data.score),
    }));

    tempCampaignDataState.sort((a, b) => b.score - a.score);

    const newCampaignDataWithPosition = tempCampaignDataState.map(
      (item, newIndex) => {
        const oldIndex = item.originalIndex;
        const translateY = (oldIndex - newIndex) * 50;
        const occurrence = Math.abs(translateY) / 50;
        return {
          ...item,
          translateY,
          originalIndex: newIndex,
          additionalIndex: translateY > 0 ? occurrence : -occurrence,
        };
      }
    );

    setCampaignDataState(newCampaignDataWithPosition);
  };

  const getRandomScore = (score: number): number =>
    Math.floor(Math.random() * 5000) + score + 1;

  return (
    <Table>
      {campaignDataState.map((campaign, index) => {
        return (
          <Row key={index} translateY={campaign.translateY}>
            <NameContainer>
              <IndexNumber index={index}>
                {index + 1 + campaign.additionalIndex}
              </IndexNumber>
              <Name>{campaign.displayName}</Name>
            </NameContainer>
            <Score>{campaign.score}pt</Score>
          </Row>
        );
      })}
    </Table>
  );
};

export default App;
