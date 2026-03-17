let reportFinal = ""

export const $ = id => document.getElementById(id)

export function getReportFinal() {
    return reportFinal
}

export function setReport(texto) {
    reportFinal = texto
    $("preview").innerText = texto
}

// Lê um campo de texto — sempre retorna "*" se vazio
export function val(id) {
    return $(`${id}`)?.value?.trim() || "*"
}

// Lê vários campos de uma vez
// val("ca-acao", "ca-appname") → { "ca-acao": "...", "ca-appname": "..." }
export function vals(...ids) {
    return Object.fromEntries(ids.map(id => [id, val(id)]))
}

export function formatarData(data) {
    if (!data) return "''"
    const d = new Date(data)
    const dia = d.toLocaleDateString("pt-BR")
    const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    return `${dia} ${hora}`
}

export function getTextoSelect(id) {
    const el = $(id)
    return el.options[el.selectedIndex].text
}

export function getTurno(id) {
    const map = { "Manhã": "T1 → T2", "Tarde": "T2 → T3", "Noite": "T3 → T1" }
    return map[$(id).value] ?? $(id).value
}

export function getHoje() {
    return new Date().toLocaleDateString("pt-BR")
}

export function getFallout(prefix) {
    const parse = id => {
        const el = $(id)
        if (!el?.value) return "*"
        return parseFloat(el.value).toFixed(2).replace(".", ",")
    }
    return {
        prospect: parse(`${prefix}-prospect`),
        base: parse(`${prefix}-base`),
        pme: parse(`${prefix}-pme`),
    }
}

export function getAlertasN1() {
    const items = document.querySelectorAll(".alerta-item")
    if (!items.length) return "Nenhum alerta durante o turno."
    return Array.from(items).map(item => {
        const nome = item.querySelector(".alerta-nome").value.trim()
        const link = item.querySelector(".alerta-link").value.trim()
        if (!nome) return null
        return link ? `${nome}\n${link}` : nome
    }).filter(Boolean).join("\n\n")
}

export function inicializarCampos(onChangeCb) {
    const dataVencInput = $("data-venc")
    if (dataVencInput && !dataVencInput.value) {
        const amanha = new Date()
        amanha.setDate(amanha.getDate() + 1)
        dataVencInput.value = amanha.toLocaleDateString("pt-BR")
    }

    const checkboxHoje = $("tem-hoje")
    const grupoHoje = $("grupo-hoje")

    if (checkboxHoje && !checkboxHoje._listenerAdded) {
        checkboxHoje._listenerAdded = true
        checkboxHoje.addEventListener("change", () => {
            if (checkboxHoje.checked) {
                grupoHoje.style.display = "grid"
                if ($("data-hoje")) $("data-hoje").value = new Date().toLocaleDateString("pt-BR")
            } else {
                grupoHoje.style.display = "none"
                if ($("qtd-hoje")) $("qtd-hoje").value = ""
            }
            onChangeCb?.()
        })
    }
}