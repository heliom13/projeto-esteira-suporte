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
  margin: 0;
  padding: 0 0 40px;
`;