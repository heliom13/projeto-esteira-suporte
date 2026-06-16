import styled from "styled-components";
import React from "react";
import { Outlet } from "react-router-dom";

const MobileLayout = ({ children }: any) => {
  return (
    <Container
    >
      {children}
      <Outlet />
    </Container>
  );
};

export default MobileLayout;

const Container = styled.div`
  width: 100%;
  max-width: 90%;
  margin-right: auto;
  margin-left: auto;
  padding: 30px;
  @media screen and (max-width: 480px) {
    padding: 50px;
  }
`;