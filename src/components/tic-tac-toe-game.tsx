
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw, Trophy } from 'lucide-react';
import { useConfetti } from './confetti-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Square = ({ value, onClick }: { value: 'X' | 'O' | null, onClick: () => void }) => {
    const isX = value === 'X';
    const isO = value === 'O';
    return (
        <Button
            variant="outline"
            className={cn(
                "w-20 h-20 text-4xl font-bold",
                isX && "text-primary",
                isO && "text-destructive"
            )}
            onClick={onClick}
        >
            {value}
        </Button>
    )
};

const calculateWinner = (squares: Array<'X' | 'O' | null>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const { triggerConfetti } = useConfetti();
  const audioRef = useRef<HTMLAudioElement>(null);


  const winner = calculateWinner(board);
  const isBoardFull = board.every(square => square !== null);

  useEffect(() => {
    if (winner) {
      triggerConfetti();
      audioRef.current?.play();
      setIsWinnerDialogOpen(true);
    } else if (isBoardFull) {
      setIsWinnerDialogOpen(true);
    }
  }, [winner, isBoardFull, triggerConfetti]);


  const handleClick = (i: number) => {
    if (winner || board[i]) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    // AI's turn
    setTimeout(() => {
        const squares = newBoard.slice();
        if (calculateWinner(squares) || squares.every(Boolean)) return;

        let bestMove = -1;
        // Check for winning move
        for (let j = 0; j < 9; j++) {
            if (!squares[j]) {
                squares[j] = 'O';
                if (calculateWinner(squares) === 'O') {
                    bestMove = j;
                    squares[j] = null;
                    break;
                }
                squares[j] = null;
            }
        }

        // Check for blocking move
        if (bestMove === -1) {
            for (let j = 0; j < 9; j++) {
                if (!squares[j]) {
                    squares[j] = 'X';
                    if (calculateWinner(squares) === 'X') {
                        bestMove = j;
                        squares[j] = null;
                        break;
                    }
                    squares[j] = null;
                }
            }
        }
        
        // Choose random available square
        if (bestMove === -1) {
            const emptySquares = squares.map((sq, index) => sq === null ? index : null).filter(val => val !== null);
            bestMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        }
        
        if (bestMove !== -1) {
            squares[bestMove] = 'O';
            setBoard(squares);
            setIsXNext(true);
        }
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsWinnerDialogOpen(false);
  };

  let status;
  if (winner) {
    status = `Player ${winner} Wins!`;
  } else if (isBoardFull) {
    status = 'It\'s a draw!';
  } else {
    status = `Your turn (X)`;
  }
  
  const getDialogContent = () => {
      if (winner === 'X') {
          return { title: "Congratulations!", description: "You've won the game. Great job!"};
      }
      if (winner === 'O') {
          return { title: "Better Luck Next Time!", description: "The AI has won this round. Try again!"};
      }
      return { title: "It's a Draw!", description: "A well-fought match on both sides!" };
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Play a Game</CardTitle>
          <CardDescription>A quick game of Tic-Tac-Toe against our AI.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold">{status}</div>
          <div className="relative">
              <div className="grid grid-cols-3 gap-2">
                  {board.map((_, i) => (
                      <Square key={i} value={board[i]} onClick={() => isXNext && handleClick(i)} />
                  ))}
              </div>
          </div>
          <Button onClick={resetGame} variant="ghost" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={isWinnerDialogOpen} onOpenChange={setIsWinnerDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <Trophy className="h-16 w-16 text-yellow-500"/>
            <AlertDialogTitle className="text-2xl">{getDialogContent().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getDialogContent().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/human_voices/celebration_dance_party.ogg" preload="auto"></audio>
    </>
  );
}
