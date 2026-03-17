import { $, setReport, getTurno, getHoje, getFallout, inicializarCampos } from "../js/script.js"

export function gerarTurno() {
    if (!$("turno")) return;

    inicializarCampos();

    const turno = getTurno("turno");
    const hoje = getHoje();

    const resumo =
        $("resumo-turno").value.trim() ||
        "Não tivemos nenhum incidente pendente durante o turno, seguimos com o tratamento das tarefas.";

    const { prospect, base, pme } = getFallout("n2");

    const qtd = $("qtd-chamados").value || "*";
    const dataVenc = $("data-venc").value || "*";
    const sla = $("sla-horario").value || "*";
    const sla2 = $("sla-horario2").value || "*";

    const fila = $("cnt-fila").value || "*";
    const atend = $("cnt-atendimento").value || "*";
    const externo = $("cnt-externo").value || "*";
    const reaberto = $("cnt-reaberto").value || "*";

    const temHoje = $("tem-hoje")?.checked;
    const qtdHoje = $("qtd-hoje")?.value || "*";
    const dataHoje = new Date().toLocaleDateString("pt-BR");

    let pendencias = "";
    if (temHoje) {
        pendencias += `* *${qtdHoje}* Chamados para hoje - SLA *${sla2}* \n`;
    }
    pendencias += `* *${qtd}* Chamados com vencimento para *${dataVenc}* - SLA *${sla}*.`;

    setReport(
        `*📄 Passagem de Turno N2 Solar (${turno}) – ${hoje}*
 
*✅ Atividades Realizadas*
* Tratamento dos chamados Solar;
* Tratamento do OM;
* Atendimento COTI.
 
*📌 Resumo do Turno*
* ${resumo}
 
📊 Indicadores FallOut:
 Prospect: *${prospect}%*
 Base: *${base}%*
 PME: *${pme}%*
 
⚠️ Pendências
${pendencias}
 
🚨 Priorizados
* *${fila}* Em fila;
* *${atend}* Em atendimento;
* *${externo}* Aguardando retorno externo;
* *${reaberto}* Reaberto.`
    );
}