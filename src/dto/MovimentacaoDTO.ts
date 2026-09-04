export interface MovimentacaoDTO {
    id_movimentacao?: number;
    id_produto: number;
    id_movimentacao_origem?: number | null;
    tipo: 'ENTRADA' | 'SAIDA';
    motivo: 'RECEBIMENTO' | 'VENDA' | 'USO_INTERNO' | 'PERDA' | 'DANIFICADO' | 'CORRECAO';
    quantidade: number;
    preco_unitario_praticado?: number | null;
    valor_total?: number | null;
    observacao: string;
    data_movimentacao?: string;
}

export type CorrecaoMovimentacaoDTO = Pick<MovimentacaoDTO, 'tipo' | 'quantidade' | 'observacao'>;
