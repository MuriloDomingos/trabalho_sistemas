import React, { createContext, useContext, useMemo, useState } from 'react';
import { Stack } from 'expo-router';

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
};

export type ItemCarrinho = Produto & { quantidade: number };

export const CORES = {
  primaria: '#3D5AFE',
  sucesso: '#2EC478',
  escura: '#202A44',
  secundaria: '#464E5C',
  erro: '#EB5757',
  fundo: '#F2F4F7',
  branco: '#FFFFFF',
  borda: '#D9DEE8',
};

export const produtos: Produto[] = [
  { id: '1', nome: 'X-Burger', descricao: 'Pão, carne e queijo', preco: 24.9, imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800' },
  { id: '2', nome: 'X-Salada', descricao: 'Alface, tomate e queijo', preco: 27.9, imagem: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800' },
  { id: '3', nome: 'X-Bacon', descricao: 'Bacon crocante e queijo', preco: 29.9, imagem: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800' },
  { id: '4', nome: 'Batata Frita', descricao: 'Porção crocante e dourada', preco: 18.9, imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800' },
  { id: '5', nome: 'Milkshake', descricao: 'Milkshake cremoso de chocolate', preco: 16.9, imagem: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800' },
];

type CarrinhoContextType = {
  itens: ItemCarrinho[];
  adicionar: (produto: Produto) => void;
  alterarQuantidade: (id: string, delta: number) => void;
  limpar: () => void;
  quantidadeTotal: number;
  subtotal: number;
  taxaEntrega: number;
  desconto: number;
  total: number;
  setCupom: (cupom: string) => void;
  cupom: string;
};

const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) throw new Error('useCarrinho deve ser usado dentro do CarrinhoProvider.');
  return contexto;
}

function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [cupom, setCupom] = useState('');

  function adicionar(produto: Produto) {
    setItens((atuais) => {
      const existente = atuais.find((item) => item.id === produto.id);
      if (existente) {
        return atuais.map((item) => item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...atuais, { ...produto, quantidade: 1 }];
    });
  }

  function alterarQuantidade(id: string, delta: number) {
    setItens((atuais) => atuais
      .map((item) => item.id === id ? { ...item, quantidade: item.quantidade + delta } : item)
      .filter((item) => item.quantidade > 0));
  }

  function limpar() {
    setItens([]);
    setCupom('');
  }

  const quantidadeTotal = useMemo(() => itens.reduce((soma, item) => soma + item.quantidade, 0), [itens]);
  const subtotal = useMemo(() => itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0), [itens]);
  const taxaEntrega = quantidadeTotal > 0 ? 6 : 0;
  const desconto = cupom.trim().toUpperCase() === 'ALUNO10' ? subtotal * 0.10 : 0;
  const total = subtotal - desconto + taxaEntrega;

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, alterarQuantidade, limpar, quantidadeTotal, subtotal, taxaEntrega, desconto, total, setCupom, cupom }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <CarrinhoProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CarrinhoProvider>
  );
}
