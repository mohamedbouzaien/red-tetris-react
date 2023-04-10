import React, { useState, useContext, useEffect, useRef } from "react";
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import Chat from "./Chat";
import WebSocketProvider, { WebSocketContext } from '../webSocket';
import { Provider, useSelector } from "react-redux";
import { StyledTetris, StyledTetrisWrapper } from "./styles/StyledTetris";
import { useStage } from "../hooks/useStage";
import { GAME_MODE, PLAYER_STATUS, createStage } from "../gamehelpers";
import { useInterval } from "../hooks/useInterval";
import store from "../store";
import { randomTetromino } from "../tetrominos";
import io from "socket.io-client";
import { StyledOtherTetrises } from "./styles/StyledOtherTetrises";
import { StyledModeDiv, StyledArrowButtons, StyledModeBoxDiv } from "./styles/StyledModeDiv";

const Tetris = ({history, match}) => {
    const player = useSelector(state =>state.player);
    const gameOver = useSelector(state => state.gameOver);
    const room = useSelector(state => state.room);
    const [dropTime, setDropTime] = useState(null);
    const [disabledButton, setDisabledButton] = useState(false);
    const [disabledModeButton, setDisabledModeButton] = useState(false);
    const [modeText, setModeText] = useState("NORMAL");
    const ws = useContext(WebSocketContext);
    const wrapperRef = useRef(null);
    const gameMode = useSelector(state => state.mode);
    
    const startGame = async () => {
        await ws.gameStart();
        setDisabledButton(true);
        wrapperRef.current.focus();
    }
    
    const quit = () => {
        history.push(`/`);
    }

    const rightMode = ()  => {
        if (gameMode === GAME_MODE.STANDARD) {
            ws.changeMode(GAME_MODE.HEART);
        } else if (gameMode === GAME_MODE.HEART) {
            ws.changeMode(GAME_MODE.SPRINT);
        } else if (gameMode === GAME_MODE.SPRINT) {
            ws.changeMode(GAME_MODE.STANDARD);
        }
    }

    const leftMode = () => {
        if (gameMode === GAME_MODE.STANDARD) {
            ws.changeMode(GAME_MODE.SPRINT);
        } else if (gameMode === GAME_MODE.HEART) {
            ws.changeMode(GAME_MODE.STANDARD);
        } else if (gameMode === GAME_MODE.SPRINT) {
            ws.changeMode(GAME_MODE.HEART);
        }
    }
    
    const move = async ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                await ws.playerMove(-1);
            } else if (keyCode === 39) {
                await ws.playerMove(1);
            } else if (keyCode === 40) {
                await ws.playerDrop();
            } else if (keyCode === 38) {
                await ws.playerRotate(1);
            }
        }
    }

    useEffect(() => {
        if (gameMode === GAME_MODE.STANDARD) {
            setModeText("NORMAL");
        } else if (gameMode === GAME_MODE.HEART) {
            setModeText("HEART");
        } else if (gameMode === GAME_MODE.SPRINT) {
            setModeText("SPRINT");
        }
    }, [gameMode]);

    useEffect(() => {
        return() => {
            console.log("socket disconnect");
            ws.disconnect();
        }
    }, []);

    useEffect(() => {
        if (room?.isStarted === true) {
            console.log("Git to set Time");
            setDropTime(player?.dropTime);
            setDisabledModeButton(true);
            setDisabledButton(true);
        } else {
            room?.players.forEach(p => {
                if (p.status !== PLAYER_STATUS.READY && p.nickname !== room?.ownerName && room.ownerName === player.nickname)
                    setDisabledButton(true);
                else
                    setDisabledButton(false);
            });
        }
        if (room?.ownerName !== player?.nickname) {
            setDisabledModeButton(true);
        }
     }, [player, room]) 

    useInterval(async () => {
        if (!gameOver)
            await ws.playerDrop();
    }, dropTime);

    return (
                <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={ e => move(e)} ref={wrapperRef}>
                    <div style={{display:"flex",
                        flexDirection:"row"}}>
                        <StyledModeBoxDiv>
                            <h3 style={{color: "white", fontFamily:"Pixel"}}>MODE</h3>
                            <div style={{display:"flex",
                                flexDirection:"row"}}>
                                <StyledArrowButtons disabled={disabledModeButton} onClick={leftMode}>&#8592;</StyledArrowButtons>
                                <StyledModeDiv>{modeText}</StyledModeDiv>
                                <StyledArrowButtons disabled={disabledModeButton} onClick={rightMode}>&#8594;</StyledArrowButtons>
                            </div>
                        </StyledModeBoxDiv>
                        <StyledTetris>
                            <div style={{display:"block",
                            textAlign:"center"}}>
                            <h3 style={{color:"white"}}>{player ? player.nickname : ""}</h3>
                            <Stage stage={ player ? player.stage : null } scale={1} status={player ? player.status : 0}/>
                            </div>
                            <aside>
                                {gameOver ? (
                                    <Display gameOver={gameOver} text="Game Over" />
                                ) : (
                                <div>
                                    <Display text={`Score: ${player ? player.score : 0}`} />
                                    <Display text={`Rows: ${player ? player.rows : 0}`} />
                                    <Display text={`Level: ${player ? player.level : 0}`} />
                                </div>
                                )}
                                <StartButton disabled={disabledButton} text={room && player && room.ownerName === player.nickname ? "Start" : "Ready" } callback={startGame}/>
                                <StartButton disabled={false} text={ "QUIT" } callback={quit}/>
                            </aside>

                        </StyledTetris>
                        <StyledOtherTetrises>
                        {
                            room && player &&
                            room.players.map((p) => p.nickname === player.nickname ? 
                            <div key={p.nickname} ></div> : 
                            <div key={p.nickname} style={{display:"block",
                            textAlign:"center"}}>
                                <h4 style={{color:"white"}}>{p.nickname}</h4>
                                <Stage key={p.nickname} stage={p.stage} scale={0.5} status = {p.status}/>
                            </div>
                            )
                        }
                        </StyledOtherTetrises>
                    </div>
                    <Chat history={history} match={match}/>
                </StyledTetrisWrapper>
    )
}

export default React.memo(Tetris);
