import styled from "styled-components";

export  const StyledChatHistoryDiv = styled.div`
    width: 80%;
    border: 1px solid #ccc;
    height:40%; 
    text-align: left;
    padding: 10px;
    min-height: 200px;
    margin-bottom: 10px;
    margin-left: 10px;
    background: rgba(0, 0, 0, .6);
    overflow-y: scroll;
    i {
        color: pink;
        font-weight: bold;
        font-family: 'Roboto', sans-serif;
    }
    div {
        color: green;
        font-family: 'Roboto', sans-serif;
    }
`;