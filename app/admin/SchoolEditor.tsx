"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";

const schoolUrl = "https://cursos-matheus-vidal.vercel.app";

type Lesson = { id: string; title: string; duration: string; videoUrl: string };
type Question = { id: string; prompt: string; options: string[]; correctOption: number; explanation: string };
type Module = { id: string; title: string; lessons: Lesson[]; questions: Question[] };
type Course = { id: string; name: string; subtitle: string; description: string; price: string; category: string; accent: string; modules: Module[] };
type Config = { teacher: string; courses: Course[]; payment: { pixKey: string; receiverName: string; receiverCity: string; supportWhatsapp: string } };
type OrderStatus = "awaiting_payment" | "submitted" | "approved" | "rejected";
type AdminOrder = { id: string; userName: string; userEmail: string; courseName: string; amount: string; status: OrderStatus; createdAt: string };
type Section = "courses" | "questions" | "pix" | "orders" | "security";

const blankConfig: Config = { teacher: "Matheus Vidal", courses: [], payment: { pixKey: "", receiverName: "", receiverCity: "", supportWhatsapp: "" } };
const statusLabel: Record<OrderStatus, string> = { awaiting_payment: "Aguardando Pix", submitted: "Em análise", approved: "Acesso liberado", rejected: "Recusado" };

export default function SchoolEditor() {
  const [pin, setPin] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [config, setConfig] = useState<Config>(blankConfig);
  const [activeCourse, setActiveCourse] = useState(0);
  const [section, setSection] = useState<Section>("courses");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [uploads, setUploads] = useState<Record<string, number>>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const course = config.courses[activeCourse];

  async function request<T>(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("x-admin-pin", pin);
    const response = await fetch(`${schoolUrl}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({})) as T & { error?: string };
    if (!response.ok) throw new Error(payload.error || "Não foi possível concluir esta ação.");
    return payload;
  }

  async function loadOrders() {
    const payload = await request<{ orders: AdminOrder[] }>("/api/admin/orders");
    setOrders(payload.orders || []);
  }

  async function connect() {
    if (!pin.trim()) return setStatus("Digite a senha administrativa da Escola Online.");
    setStatus("Conectando a escola...");
    try {
      const [nextConfig] = await Promise.all([request<Config>("/api/config"), loadOrders()]);
      setConfig(nextConfig);
      setActiveCourse(0);
      setAllowed(true);
      setStatus("");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível acessar a escola."); }
  }

  function setCourse(patch: Partial<Course>) {
    setConfig(current => ({ ...current, courses: current.courses.map((item, index) => index === activeCourse ? { ...item, ...patch } : item) }));
  }
  function setModule(moduleIndex: number, patch: Partial<Module>) {
    if (!course) return;
    setCourse({ modules: course.modules.map((item, index) => index === moduleIndex ? { ...item, ...patch } : item) });
  }
  function setLesson(moduleIndex: number, lessonIndex: number, patch: Partial<Lesson>) {
    if (!course) return;
    const module = course.modules[moduleIndex];
    setModule(moduleIndex, { lessons: module.lessons.map((item, index) => index === lessonIndex ? { ...item, ...patch } : item) });
  }
  function setQuestion(moduleIndex: number, questionIndex: number, patch: Partial<Question>) {
    if (!course) return;
    const module = course.modules[moduleIndex];
    setModule(moduleIndex, { questions: module.questions.map((item, index) => index === questionIndex ? { ...item, ...patch } : item) });
  }
  function setPayment(field: keyof Config["payment"], value: string) {
    setConfig(current => ({ ...current, payment: { ...current.payment, [field]: value } }));
  }
  function addCourse() {
    const next: Course = { id: crypto.randomUUID(), name: "Novo curso", subtitle: "Uma apresentação breve do curso.", description: "Descreva a transformação e o conteúdo deste curso.", price: "0,00", category: "FORMAÇÃO", accent: "#bb8850", modules: [] };
    setConfig(current => ({ ...current, courses: [...current.courses, next] }));
    setActiveCourse(config.courses.length);
  }
  function removeCourse() {
    if (!course) return;
    if (config.courses.length === 1) return setStatus("Mantenha pelo menos um curso cadastrado na escola.");
    setConfig(current => ({ ...current, courses: current.courses.filter((_, index) => index !== activeCourse) }));
    setActiveCourse(0);
  }
  function addModule() {
    if (!course) return;
    setCourse({ modules: [...course.modules, { id: crypto.randomUUID(), title: "Novo módulo", lessons: [], questions: [] }] });
  }
  function addLesson(moduleIndex: number) {
    if (!course) return;
    const module = course.modules[moduleIndex];
    setModule(moduleIndex, { lessons: [...module.lessons, { id: crypto.randomUUID(), title: "Nova aula", duration: "10 min", videoUrl: "" }] });
  }
  function addQuestion(moduleIndex: number) {
    if (!course) return;
    const module = course.modules[moduleIndex];
    setModule(moduleIndex, { questions: [...module.questions, { id: crypto.randomUUID(), prompt: "Nova questão", options: ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"], correctOption: 0, explanation: "" }] });
  }

  async function uploadVideo(moduleIndex: number, lessonIndex: number, file: File) {
    if (!course) return;
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    setUploads(current => ({ ...current, [lesson.id]: 0 }));
    setStatus("Enviando vídeo para a escola...");
    try {
      const blob = await upload(`videos/${course.id}/${lesson.id}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: `${schoolUrl}/api/media`,
        clientPayload: JSON.stringify({ pin }),
        onUploadProgress: event => setUploads(current => ({ ...current, [lesson.id]: Math.round(event.percentage) })),
      });
      setLesson(moduleIndex, lessonIndex, { videoUrl: blob.url });
      setUploads(current => ({ ...current, [lesson.id]: 100 }));
      setStatus("Vídeo enviado. Salve e publique para liberar a aula.");
    } catch (error) {
      setUploads(current => { const next = { ...current }; delete next[lesson.id]; return next; });
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar o vídeo.");
    }
  }

  async function save() {
    setStatus("Publicando a escola...");
    try { await request<{ ok: boolean }>("/api/config", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(config) }); setStatus("Escola publicada. Cursos, aulas e provas já estão atualizados."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível publicar a escola."); }
  }
  async function updateOrder(orderId: string, nextStatus: "approved" | "rejected") {
    setStatus(nextStatus === "approved" ? "Liberando acesso do aluno..." : "Atualizando matrícula...");
    try { await request("/api/admin/orders", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, status: nextStatus }) }); await loadOrders(); setStatus(nextStatus === "approved" ? "Acesso liberado para o aluno." : "Pedido marcado como não confirmado."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível atualizar a matrícula."); }
  }
  async function updatePassword() {
    if (newPassword !== passwordConfirmation) return setStatus("A confirmação não é igual à nova senha.");
    setStatus("Atualizando senha da escola...");
    try {
      await request("/api/admin/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      setPin(newPassword); setCurrentPassword(""); setNewPassword(""); setPasswordConfirmation(""); setStatus("Senha atualizada. Guarde a nova senha em um local seguro.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível atualizar a senha."); }
  }
  async function changeSection(next: Section) {
    setSection(next);
    if (next === "orders") { try { await loadOrders(); } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível carregar as matrículas."); } }
  }

  if (!allowed) return <section className="school-connect"><div className="school-connect-mark">MV</div><small>ESCOLA ONLINE · ÁREA PROTEGIDA</small><h2>Conecte a gestão da escola</h2><p>Use a senha administrativa da Escola Online uma vez. Depois, tudo fica editável aqui, dentro da Central MV.</p><label>Senha da escola<input type="password" value={pin} onChange={event => setPin(event.target.value)} onKeyDown={event => event.key === "Enter" && void connect()} placeholder="Senha administrativa" /></label><button className="save-button" onClick={() => void connect()}>Abrir gestão da escola</button>{status && <p className="school-connect-status" role="status">{status}</p>}</section>;

  return <section className="school-editor"><header className="school-editor-head"><div><small>ESCOLA ONLINE · GESTÃO INTEGRADA</small><h2>{section === "courses" ? "Cursos e aulas" : section === "questions" ? "Perguntas e provas" : section === "pix" ? "Configurar Pix" : section === "orders" ? "Matrículas e acessos" : "Segurança da escola"}</h2></div><div><a href={schoolUrl} target="_blank" rel="noreferrer">Ver plataforma ↗</a>{(section === "courses" || section === "questions" || section === "pix") && <button className="save-button" onClick={() => void save()}>Salvar e publicar</button>}</div></header>
    <nav className="school-editor-nav" aria-label="Seções da escola"><button className={section === "courses" ? "active" : ""} onClick={() => void changeSection("courses")}>Cursos e aulas</button><button className={section === "questions" ? "active" : ""} onClick={() => void changeSection("questions")}>Perguntas e provas</button><button className={section === "pix" ? "active" : ""} onClick={() => void changeSection("pix")}>Pagamento Pix</button><button className={section === "orders" ? "active" : ""} onClick={() => void changeSection("orders")}>Matrículas</button><button className={section === "security" ? "active" : ""} onClick={() => void changeSection("security")}>Senha</button></nav>
    {status && <p className="school-editor-status" role="status">{status}</p>}

    {section === "courses" && <div className="school-course-layout"><aside className="school-course-list"><header><div><small>CATÁLOGO</small><b>Seus cursos</b></div><span>{config.courses.length}</span></header>{config.courses.map((item, index) => <button className={index === activeCourse ? "active" : ""} key={item.id} onClick={() => setActiveCourse(index)}><i style={{ background: item.accent }} /><span><b>{item.name}</b><small>{item.modules.reduce((sum, module) => sum + module.lessons.length, 0)} aulas · {item.modules.length} módulos</small></span></button>)}<button className="school-new-course" onClick={addCourse}>＋ Adicionar curso</button></aside>
      {course && <div className="school-course-workspace"><section className="school-card school-course-info"><header><div><small>INFORMAÇÕES DO CURSO</small><h3>{course.name}</h3></div><button className="school-danger" onClick={removeCourse}>Excluir curso</button></header><div className="school-form-grid"><label>Nome do curso<input value={course.name} onChange={event => setCourse({ name: event.target.value })} /></label><label>Categoria<input value={course.category} onChange={event => setCourse({ category: event.target.value })} /></label><label className="wide">Chamada curta<input value={course.subtitle} onChange={event => setCourse({ subtitle: event.target.value })} /></label><label className="wide">Descrição<textarea value={course.description} onChange={event => setCourse({ description: event.target.value })} /></label><label>Preço em R$<input value={course.price} onChange={event => setCourse({ price: event.target.value })} /></label><label>Cor de destaque<input type="color" value={course.accent} onChange={event => setCourse({ accent: event.target.value })} /></label></div></section>
        <section className="school-modules"><header><div><small>ESTRUTURA DO CURSO</small><h3>Módulos e videoaulas</h3></div><button className="school-outline" onClick={addModule}>＋ Adicionar módulo</button></header>{course.modules.map((module, moduleIndex) => <article className="school-card school-module-card" key={module.id}><header><span>{String(moduleIndex + 1).padStart(2, "0")}</span><input value={module.title} onChange={event => setModule(moduleIndex, { title: event.target.value })} aria-label={`Nome do módulo ${moduleIndex + 1}`} /><button className="school-danger" onClick={() => setCourse({ modules: course.modules.filter((_, index) => index !== moduleIndex) })}>Excluir</button></header><div className="school-lessons">{module.lessons.map((lesson, lessonIndex) => <article className="school-lesson-row" key={lesson.id}><span>{lessonIndex + 1}</span><div className="school-lesson-fields"><label>Título da aula<input value={lesson.title} onChange={event => setLesson(moduleIndex, lessonIndex, { title: event.target.value })} /></label><label>Duração<input value={lesson.duration} onChange={event => setLesson(moduleIndex, lessonIndex, { duration: event.target.value })} /></label><label className="wide">Link do vídeo<input value={lesson.videoUrl} onChange={event => setLesson(moduleIndex, lessonIndex, { videoUrl: event.target.value })} placeholder="Enviado automaticamente ou cole um link" /></label></div><div className="school-video-upload"><label>Enviar vídeo<input type="file" accept="video/mp4,video/webm,video/ogg" onChange={event => event.target.files?.[0] && void uploadVideo(moduleIndex, lessonIndex, event.target.files[0])} /></label>{uploads[lesson.id] !== undefined && <div><i><span style={{ width: `${uploads[lesson.id]}%` }} /></i><small>{uploads[lesson.id] < 100 ? `Enviando ${uploads[lesson.id]}%` : "✓ Vídeo pronto"}</small></div>}</div><button className="school-remove-lesson" onClick={() => setModule(moduleIndex, { lessons: module.lessons.filter((_, index) => index !== lessonIndex) })} aria-label="Excluir aula">×</button></article>)}</div><button className="school-add-row" onClick={() => addLesson(moduleIndex)}>＋ Adicionar aula</button></article>)}</section>
        <section className="school-card school-assessments"><header><div><small>AVALIAÇÕES</small><h3>Provas por módulo</h3><p>O aluno só libera a prova depois de concluir todas as videoaulas do módulo.</p></div></header>{course.modules.map((module, moduleIndex) => <article className="school-assessment-module" key={module.id}><header><div><small>MÓDULO {moduleIndex + 1}</small><h4>{module.title}</h4></div><button className="school-outline" onClick={() => addQuestion(moduleIndex)}>＋ Questão</button></header>{module.questions.length === 0 && <p className="school-empty">Nenhuma questão criada neste módulo.</p>}{module.questions.map((question, questionIndex) => <div className="school-question" key={question.id}><header><b>Questão {questionIndex + 1}</b><button className="school-danger" onClick={() => setModule(moduleIndex, { questions: module.questions.filter((_, index) => index !== questionIndex) })}>Excluir</button></header><label>Pergunta<textarea value={question.prompt} onChange={event => setQuestion(moduleIndex, questionIndex, { prompt: event.target.value })} /></label><div className="school-answer-options">{question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`}>Alternativa {String.fromCharCode(65 + optionIndex)}<input value={option} onChange={event => setQuestion(moduleIndex, questionIndex, { options: question.options.map((item, index) => index === optionIndex ? event.target.value : item) })} /></label>)}</div><div className="school-answer-row"><label>Resposta correta<select value={question.correctOption} onChange={event => setQuestion(moduleIndex, questionIndex, { correctOption: Number(event.target.value) })}>{question.options.map((_, optionIndex) => <option key={optionIndex} value={optionIndex}>Alternativa {String.fromCharCode(65 + optionIndex)}</option>)}</select></label><label>Explicação após correção<input value={question.explanation} onChange={event => setQuestion(moduleIndex, questionIndex, { explanation: event.target.value })} /></label></div></div>)}</article>)}</section>
      </div>}</div>}

    {section === "questions" && <section className="school-question-studio"><header><div><small>AVALIAÇÕES DA ESCOLA</small><h3>Perguntas e provas por módulo</h3><p>Cadastre questões, escolha a resposta certa e publique. Cada prova é liberada para o aluno após ele concluir as aulas do módulo.</p></div></header><div className="school-question-course-picker"><label htmlFor="question-course">Curso que você está editando</label><select id="question-course" value={activeCourse} onChange={event => setActiveCourse(Number(event.target.value))}>{config.courses.map((item, index) => <option key={item.id} value={index}>{item.name}</option>)}</select></div>{course ? <div className="school-assessments">{course.modules.length === 0 && <div className="school-empty-card">Crie um módulo e as aulas do curso antes de cadastrar a prova.</div>}{course.modules.map((module, moduleIndex) => <article className="school-assessment-module" key={module.id}><header><div><small>MÓDULO {String(moduleIndex + 1).padStart(2, "0")}</small><h4>{module.title}</h4></div><button className="school-outline" onClick={() => addQuestion(moduleIndex)}>＋ Adicionar questão</button></header>{module.questions.length === 0 && <p className="school-empty">Nenhuma pergunta neste módulo. Clique em “Adicionar questão” para começar a prova.</p>}{module.questions.map((question, questionIndex) => <div className="school-question" key={question.id}><header><b>Questão {questionIndex + 1}</b><button className="school-danger" onClick={() => setModule(moduleIndex, { questions: module.questions.filter((_, index) => index !== questionIndex) })}>Excluir</button></header><label>Pergunta<textarea value={question.prompt} onChange={event => setQuestion(moduleIndex, questionIndex, { prompt: event.target.value })} /></label><div className="school-answer-options">{question.options.map((option, optionIndex) => <label key={`${question.id}-${optionIndex}`}>Alternativa {String.fromCharCode(65 + optionIndex)}<input value={option} onChange={event => setQuestion(moduleIndex, questionIndex, { options: question.options.map((item, index) => index === optionIndex ? event.target.value : item) })} /></label>)}</div><div className="school-answer-row"><label>Resposta correta<select value={question.correctOption} onChange={event => setQuestion(moduleIndex, questionIndex, { correctOption: Number(event.target.value) })}>{question.options.map((_, optionIndex) => <option key={optionIndex} value={optionIndex}>Alternativa {String.fromCharCode(65 + optionIndex)}</option>)}</select></label><label>Explicação após correção<input value={question.explanation} onChange={event => setQuestion(moduleIndex, questionIndex, { explanation: event.target.value })} placeholder="Explique a resposta para o aluno" /></label></div></div>)}</article>)}</div> : <div className="school-empty-card">Nenhum curso criado ainda.</div>}</section>}

    {section === "pix" && <section className="school-card school-payment"><small>PAGAMENTOS DA ESCOLA</small><h3>Dados para receber o Pix</h3><p>Essas informações geram o QR Code e o código Copia e Cola do curso. Não ficam expostas no catálogo.</p><div className="school-form-grid"><label className="wide">Chave Pix<input value={config.payment.pixKey} onChange={event => setPayment("pixKey", event.target.value)} placeholder="CPF, e-mail, telefone ou chave aleatória" /></label><label>Nome do recebedor<input value={config.payment.receiverName} onChange={event => setPayment("receiverName", event.target.value)} placeholder="Ex.: Matheus Vidal" /></label><label>Cidade do recebedor<input value={config.payment.receiverCity} onChange={event => setPayment("receiverCity", event.target.value)} placeholder="Ex.: Vitória" /></label><label className="wide">WhatsApp de suporte ao aluno<input value={config.payment.supportWhatsapp} onChange={event => setPayment("supportWhatsapp", event.target.value)} placeholder="5527999999999" /></label></div></section>}

    {section === "orders" && <section className="school-orders"><header><div><small>PAGAMENTOS E ACESSOS</small><h3>Matrículas para conferir</h3><p>Quando o Pix estiver confirmado, clique em liberar. O curso aparecerá imediatamente em “Meus cursos” para o aluno.</p></div><button className="school-outline" onClick={() => void loadOrders()}>Atualizar lista</button></header>{orders.length === 0 ? <div className="school-empty-card">Nenhuma matrícula registrada ainda.</div> : <div className="school-order-list">{orders.map(order => <article className="school-order" key={order.id}><div><span className={`school-order-badge ${order.status}`}>{statusLabel[order.status]}</span><h4>{order.courseName}</h4><p>{order.userName || "Aluno"} · {order.userEmail}</p><small>{new Date(order.createdAt).toLocaleString("pt-BR")}</small></div><b>R$ {order.amount}</b><div>{(order.status === "awaiting_payment" || order.status === "submitted") ? <><button className="school-approve" onClick={() => void updateOrder(order.id, "approved")}>Liberar acesso</button><button className="school-reject" onClick={() => void updateOrder(order.id, "rejected")}>Recusar</button></> : <span className={order.status === "approved" ? "school-access-ok" : "school-access-no"}>{order.status === "approved" ? "✓ Acesso liberado" : "Pagamento recusado"}</span>}</div></article>)}</div>}</section>}

    {section === "security" && <section className="school-card school-security"><small>SEGURANÇA</small><h3>Alterar senha da escola</h3><p>Esta senha protege o editor de cursos, vídeos, Pix e matrículas. Ela não altera o login dos alunos.</p><div className="school-form-grid"><label className="wide">Senha atual<input type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} /></label><label>Nova senha<input type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} /></label><label>Confirme a nova senha<input type="password" value={passwordConfirmation} onChange={event => setPasswordConfirmation(event.target.value)} /></label></div><button className="save-button" onClick={() => void updatePassword()}>Atualizar senha</button></section>}
  </section>;
}
