import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: right;
  z-index: 2;
  border: 1px solid #85c4e3;
`

export const Line = styled.hr`
  margin-bottom: 10px;
  border-top: 1px solid #85c4e3;
`

export const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  color: #4762ea;
  text-align: center;
  white-space: nowrap;
  margin-top: 20px;
`

export const TextOutside = styled.p`
  font-weight: 500;
  color: #474a51;
  font-size: 18px;
  margin: 5px;
`

export const Text = styled.p`
  font-weight: 500;
  color: #474a51;
`

export const WarningText = styled.p`
  font-weight: 600;
  color: red;
`

export const WarningTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  color: red;
  text-align: center;
`

export const SuccessText = styled.p`
  font-weight: 600;
  color: #4762ea;
`

export const Label = styled.span`
  font-weight: 600;
  color: #474a51;
`

export const Spinner = styled.div`
  border: 12px solid #85c4e3;
  border-top: 12px #4762ea solid;
  border-radius: 50%;
  height: 80px;
  width: 80px;
  animation: spin 2s linear infinite;
  margin: auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @media screen and (max-width: 480px) {
    border: 8px solid #85c4e3;
    border-top: 8px #4762ea solid;
    height: 50px;
    width: 50px;
  }
`

export const Button = styled.button`
  font-size: 1em;
  margin-top: 20px;
  width: 100%;
  padding: 0.25em 1em;
  border: 1.5px solid #85c4e3;
  background-color: #85c4e3;
  border-radius: 3px;
  color: #474a51;
  font-weight: 500;
`

export const TextWrap = styled.div`
  display: flex;
  gap: 5px;
  margin: 3px;
`

export const DaysText = styled.p`
  color: #4762ea;
  font-weight: 600;
`

export const WrapImage = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
`
