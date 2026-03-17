import { gerarCoti } from "../templates/coti.js"
import { gerarTurnoN1Solar } from "../templates/turno1.js"
import { gerarTurno } from "../templates/turno2.js"
import { gerarSoa } from "../templates/soa.js"
import { gerarPosPago } from "../templates/posPago.js"

let reportFinal = ""

export const $ = id => document.getElementById(id)

export function setReport(texto) {
    reportFinal = texto
    $("preview").innerText = texto
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

export function inicializarCampos() {
    const dataVencInput = $("data-venc");
    if (dataVencInput && !dataVencInput.value) {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        dataVencInput.value = amanha.toLocaleDateString("pt-BR");
    }

    const dataHojeInput = $("data-hoje");
    if (dataHojeInput && !dataHojeInput.value) {
        dataHojeInput.value = new Date().toLocaleDateString("pt-BR");
    }

    const checkboxHoje = $("tem-hoje");
    const grupoHoje = $("grupo-hoje");

    if (checkboxHoje && !checkboxHoje._listenerAdded) {
        checkboxHoje._listenerAdded = true;
        checkboxHoje.addEventListener("change", () => {
            if (checkboxHoje.checked) {
                grupoHoje.style.display = "grid";
                $("data-hoje").value = new Date().toLocaleDateString("pt-BR");
            } else {
                grupoHoje.style.display = "none";
                $("qtd-hoje").value = "";
            }
            gerarTurno();
        });
    }
}

const templates = {
    coti: { nome: "COTI", form: "form-coti", gerar: gerarCoti },
    turno1: { nome: "Passagem de Turno N1", form: "form-turno-n1-solar", gerar: gerarTurnoN1Solar },
    turno2: { nome: "Passagem de Turno N2", form: "form-turno-n2", gerar: gerarTurno },
    soa: { nome: "SOA", form: "form-soa", gerar: gerarSoa },
    posPago: { nome: "Pós-Pago", form: "form-pos-pago", gerar: gerarPosPago }
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
    form.classList.remove("hidden")
    form.classList.add("active")

    limparValidacao(form)
    setReport("")
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
    const lista = $("n1-alertas-lista")
    if (lista) lista.innerHTML = ""
    setReport("")
}

window.copiar = () => {
    if (!validar()) { feedbackCopiar(false); return }
    navigator.clipboard.writeText(reportFinal)
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

