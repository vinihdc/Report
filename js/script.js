import { gerarCoti } from "../templates/coti.js"
import { gerarTurnoN1Solar } from "../templates/turno1.js"
import { gerarTurno } from "../templates/turno2.js"
import { gerarSoa } from "../templates/soa.js"
import { gerarPosPago } from "../templates/posPago.js"
import { gerarFca } from "../templates/fca.js"
import { $, getReportFinal, setReport, inicializarCampos } from "./utils.js"

const templates = {
    coti: { nome: "COTI", form: "form-coti", gerar: gerarCoti },
    turno1: { nome: "Passagem de Turno N1", form: "form-turno-n1-solar", gerar: gerarTurnoN1Solar },
    turno2: { nome: "Passagem de Turno N2", form: "form-turno-n2", gerar: gerarTurno },
    soa: { nome: "SOA", form: "form-soa", gerar: gerarSoa },
    posPago: { nome: "Pós-Pago", form: "form-pos-pago", gerar: gerarPosPago },
    fca: { nome: "FCA - TV do Futuro", form: "form-fca", gerar: gerarFca },
}

const templateSelect = $("template")

Object.entries(templates).forEach(([key, t]) => {
    const opt = document.createElement("option")
    opt.value = key
    opt.textContent = t.nome
    templateSelect.appendChild(opt)
})

templateSelect.addEventListener("change", trocarTemplate)

document.querySelectorAll(".form input, .form select, .form textarea")
    .forEach(el => {
        el.addEventListener("input", gerar)
        if (el.required) {
            el.addEventListener("blur", () => el.dataset.dirty = "1", { once: true })
            el.addEventListener("blur", () => validarCampo(el))
            el.addEventListener("input", () => { if (el.dataset.dirty) validarCampo(el) })
        }
    })

function trocarTemplate() {
    document.querySelectorAll(".template").forEach(el => {
        el.classList.remove("active")
        el.classList.add("hidden")
    })

    const t = templates[templateSelect.value]
    if (!t) return

    const form = $(t.form)
    if (!form) return

    form.classList.remove("hidden")
    form.classList.add("active")
    limparValidacao(form)
    setReport("")
    inicializarCampos(gerar)
    inicializarFca()
    gerar()
}

function gerar() {
    const t = templates[templateSelect.value]
    if (!t) return
    t.gerar()
}

function validar() {
    const form = document.querySelector(".form.active")
    if (!form.checkValidity()) { form.reportValidity(); return false }
    return true
}

function feedbackCopiar(ok) {
    const btn = $("btn-copiar")
    btn.innerText = ok ? "✅" : "❌"
    setTimeout(() => btn.innerText = "📋", 2000)
}

window.gerar = gerar

window.limpar = () => {
    const form = document.querySelector(".form.active")
    form.reset()
    limparValidacao(form)
    const listas = ["n1-alertas-lista", "fca-acoes-lista", "fca-ambientes-lista", "fca-responsaveis-lista"]
    listas.forEach(id => { const el = $(id); if (el) el.innerHTML = "" })
    setReport("")
}

window.copiar = () => {
    if (!validar()) { feedbackCopiar(false); return }
    navigator.clipboard.writeText(getReportFinal())
    feedbackCopiar(true)
}

window.adicionarAlerta = () => {
    const lista = $("n1-alertas-lista")
    const div = document.createElement("div")
    div.className = "alerta-item group"
    div.innerHTML = `
        <input class="alerta-nome" placeholder="Nome do alerta (ex: Alerta P4: SOLAR...)">
        <input class="alerta-link" placeholder="Link (opcional)">
        <button type="button" class="btn-remove">🗑️</button>
    `
    div.querySelector(".btn-remove").addEventListener("click", () => { div.remove(); gerar() })
    div.querySelectorAll("input").forEach(el => el.addEventListener("input", gerar))
    lista.appendChild(div)
}

window.alternarTema = () => {
    const bright = document.documentElement.classList.toggle("bright")
    $("btn-tema").innerText = bright ? "☀️" : "🌙"
}

trocarTemplate()

function validarCampo(el) {
    const vazio = !el.value.trim()
    el.classList.toggle("invalid", vazio)
    el.classList.toggle("valid", !vazio)
}

function limparValidacao(form) {
    form.querySelectorAll(".invalid, .valid").forEach(el => {
        el.classList.remove("invalid", "valid")
        delete el.dataset.dirty
    })
}

function inicializarFca() {
    const toggles = [
        { check: "fca-tem-volumetria", grupo: "fca-grupo-volumetria", input: "fca-volumetria" },
        { check: "fca-tem-incidente", grupo: "fca-grupo-incidente", input: "fca-incidente" },
    ]

    toggles.forEach(({ check, grupo, input }) => {
        const checkbox = $(check)
        const grupoEl = $(grupo)
        if (!checkbox || checkbox._listenerAdded) return
        checkbox._listenerAdded = true
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                grupoEl.style.display = "grid"
            } else {
                grupoEl.style.display = "none"
                $(input).value = ""
            }
            gerar()
        })
    })
}

window.adicionarAcaoFca = () => {
    const lista = $("fca-acoes-lista")
    const div = document.createElement("div")
    div.className = "fca-acao-item group"
    div.innerHTML = `
        <textarea class="fca-acao-texto" placeholder="Descreva a ação" style="grid-column: 1 / -1;"></textarea>
        <button type="button" class="btn-remove" style="grid-column: 1 / -1;">🗑️ Remover</button>
    `
    div.querySelector(".btn-remove").addEventListener("click", () => { div.remove(); gerar() })
    div.querySelector("textarea").addEventListener("input", gerar)
    lista.appendChild(div)
}

window.adicionarAmbienteFca = () => {
    const lista = $("fca-ambientes-lista")
    const div = document.createElement("div")
    div.className = "fca-ambiente-item group"
    div.innerHTML = `
        <input class="fca-ambiente-texto" placeholder="Ex: CLARO TV+" style="grid-column: 1 / -1;">
        <button type="button" class="btn-remove" style="grid-column: 1 / -1;">🗑️ Remover</button>
    `
    div.querySelector(".btn-remove").addEventListener("click", () => { div.remove(); gerar() })
    div.querySelector("input").addEventListener("input", gerar)
    lista.appendChild(div)
}

window.adicionarResponsavelFca = () => {
    const lista = $("fca-responsaveis-lista")
    const div = document.createElement("div")
    div.className = "fca-responsavel-item group"
    div.innerHTML = `
        <input class="fca-responsavel-texto" placeholder="Ex: MOPS TV DO FUTURO" style="grid-column: 1 / -1;">
        <button type="button" class="btn-remove" style="grid-column: 1 / -1;">🗑️ Remover</button>
    `
    div.querySelector(".btn-remove").addEventListener("click", () => { div.remove(); gerar() })
    div.querySelector("input").addEventListener("input", gerar)
    lista.appendChild(div)
}