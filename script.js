// ===== VARIÁVEIS GLOBAIS =====
const elementos = {
  // Inputs principais
  salarioMensal: document.getElementById('salarioMensal'),
  totalColaboradores: document.getElementById('totalColaboradores'),
  totalDesligamentos: document.getElementById('totalDesligamentos'),
  custoSistema: document.getElementById('custoSistema'),

  // Parâmetros
  multiplicadorEncargos: document.getElementById('multiplicadorEncargos'),
  custoHoraRH: document.getElementById('custoHoraRH'),
  custoHoraGerente: document.getElementById('custoHoraGerente'),
  horasRecrutamento: document.getElementById('horasRecrutamento'),
  horasTreinamento: document.getElementById('horasTreinamento'),
  reducaoTurnover: document.getElementById('reducaoTurnover'),

  // Botão e resultados
  calcularBtn: document.getElementById('calcularBtn'),
  resultados: document.getElementById('resultados'),

  // Outputs
  resultadoTurnover: document.getElementById('resultadoTurnover'),
  custoUnitario: document.getElementById('custoUnitario'),
  custoAnual: document.getElementById('custoAnual'),
  economiaEstimada: document.getElementById('economiaEstimada'),
  roiFinal: document.getElementById('roiFinal'),
  insightsContent: document.getElementById('insightsContent'),
};

// ===== UTILITÁRIOS =====

/**
 * Formata valor monetário para padrão brasileiro
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: "R$ 1.234,56")
 */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

/**
 * Formata percentual para exibição
 * @param {number} valor - Valor percentual
 * @returns {string} - Percentual formatado (ex: "15,50%")
 */
function formatarPercentual(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor / 100);
}

/**
 * Valida se todos os campos obrigatórios estão preenchidos
 * @returns {boolean} - True se válido, false caso contrário
 */
function validarInputs() {
  const camposObrigatorios = [
    elementos.salarioMensal,
    elementos.totalColaboradores,
    elementos.totalDesligamentos,
    elementos.custoSistema,
  ];

  for (let campo of camposObrigatorios) {
    if (!campo.value || parseFloat(campo.value) < 0) {
      campo.focus();
      alert(
        `Por favor, preencha o campo "${campo.previousElementSibling.textContent}" com um valor válido.`
      );
      return false;
    }
  }

  // Validação específica: desligamentos não pode ser maior que colaboradores
  const totalColaboradores = parseFloat(elementos.totalColaboradores.value);
  const totalDesligamentos = parseFloat(elementos.totalDesligamentos.value);

  if (totalDesligamentos > totalColaboradores) {
    alert(
      'O número de desligamentos não pode ser maior que o total de colaboradores.'
    );
    elementos.totalDesligamentos.focus();
    return false;
  }

  return true;
}

// ===== CÁLCULOS PRINCIPAIS =====

/**
 * Realiza todos os cálculos de ROI
 * @returns {Object} - Objeto com todos os resultados calculados
 */
function calcularROI() {
  // Captura dos valores dos inputs
  const salarioMensal = parseFloat(elementos.salarioMensal.value);
  const totalColaboradores = parseFloat(elementos.totalColaboradores.value);
  const totalDesligamentos = parseFloat(elementos.totalDesligamentos.value);
  const custoSistema = parseFloat(elementos.custoSistema.value);

  const multiplicadorEncargos = parseFloat(
    elementos.multiplicadorEncargos.value
  );
  const custoHoraRH = parseFloat(elementos.custoHoraRH.value);
  const custoHoraGerente = parseFloat(elementos.custoHoraGerente.value);
  const horasRecrutamento = parseFloat(elementos.horasRecrutamento.value);
  const horasTreinamento = parseFloat(elementos.horasTreinamento.value);
  const reducaoTurnover = parseFloat(elementos.reducaoTurnover.value);

  // CÁLCULO 1: Taxa de Turnover Anual
  const taxaTurnover = (totalDesligamentos / totalColaboradores) * 100;

  // CÁLCULO 2: Custo de Recrutamento por vaga
  const custoRecrutamento = horasRecrutamento * custoHoraRH;

  // CÁLCULO 3: Custo de Treinamento por vaga
  const custoTreinamento = horasTreinamento * custoHoraGerente;

  // CÁLCULO 4: Custo de Desligamento (perda de produtividade + rescisão)
  const custoDesligamento = salarioMensal * multiplicadorEncargos;

  // CÁLCULO 5: Custo Total de UM Desligamento
  const custoTotalUmDesligamento =
    custoRecrutamento + custoTreinamento + custoDesligamento;

  // CÁLCULO 6: Custo Total Anual com Turnover
  const custoTotalAnual = custoTotalUmDesligamento * totalDesligamentos;

  // CÁLCULO 7: Economia Anual Estimada com o Sistema
  const economiaAnual = custoTotalAnual * (reducaoTurnover / 100);

  // CÁLCULO 8: ROI do Sistema
  const roiSistema = ((economiaAnual - custoSistema) / custoSistema) * 100;

  // CÁLCULO 9: Payback em meses
  const paybackMeses = custoSistema / (economiaAnual / 12);

  return {
    taxaTurnover,
    custoTotalUmDesligamento,
    custoTotalAnual,
    economiaAnual,
    roiSistema,
    paybackMeses,
    // Dados adicionais para insights
    custoRecrutamento,
    custoTreinamento,
    custoDesligamento,
  };
}

// ===== GERAÇÃO DE INSIGHTS =====

/**
 * Gera insights personalizados baseados nos resultados
 * @param {Object} resultados - Resultados dos cálculos
 * @returns {Array} - Array de insights
 */
function gerarInsights(resultados) {
  const insights = [];

  // Insight sobre taxa de turnover
  if (resultados.taxaTurnover > 15) {
    insights.push(
      'Sua taxa de turnover está acima da média nacional (12%). Há potencial significativo de economia.'
    );
  } else if (resultados.taxaTurnover > 8) {
    insights.push(
      'Sua taxa de turnover está na média. O sistema pode ajudar a otimizar ainda mais.'
    );
  } else {
    insights.push(
      'Excelente! Sua taxa de turnover está baixa. O sistema ajudará a manter essa performance.'
    );
  }

  // Insight sobre ROI
  if (resultados.roiSistema > 200) {
    insights.push(
      'ROI excelente! O investimento se paga rapidamente e gera economia substancial.'
    );
  } else if (resultados.roiSistema > 100) {
    insights.push(
      'Bom ROI. O sistema dobra o valor investido no primeiro ano.'
    );
  } else if (resultados.roiSistema > 0) {
    insights.push(
      'ROI positivo. O sistema gera economia mesmo com taxa de turnover baixa.'
    );
  } else {
    insights.push(
      'Com a taxa atual de turnover, considere outros benefícios qualitativos do sistema.'
    );
  }

  // Insight sobre payback
  if (resultados.paybackMeses < 6) {
    insights.push(
      'Payback muito rápido! O investimento se paga em menos de 6 meses.'
    );
  } else if (resultados.paybackMeses < 12) {
    insights.push(
      `Investimento se paga em ${Math.round(resultados.paybackMeses)} meses.`
    );
  }

  // Insight sobre maior componente de custo
  const maiorCusto = Math.max(
    resultados.custoRecrutamento,
    resultados.custoTreinamento,
    resultados.custoDesligamento
  );
  if (maiorCusto === resultados.custoDesligamento) {
    insights.push(
      'O maior custo está na perda de produtividade. Focar na retenção é fundamental.'
    );
  } else if (maiorCusto === resultados.custoTreinamento) {
    insights.push(
      'Alto custo de treinamento. Melhorar o fit cultural pode reduzir significativamente os custos.'
    );
  } else {
    insights.push(
      'Alto custo de recrutamento. Automatizar processos pode gerar grande economia.'
    );
  }

  return insights;
}

// ===== EXIBIÇÃO DOS RESULTADOS =====

/**
 * Atualiza a interface com os resultados calculados
 * @param {Object} resultados - Resultados dos cálculos
 */
function exibirResultados(resultados) {
  // Atualiza os valores na tela
  elementos.resultadoTurnover.textContent = formatarPercentual(
    resultados.taxaTurnover
  );
  elementos.custoUnitario.textContent = formatarMoeda(
    resultados.custoTotalUmDesligamento
  );
  elementos.custoAnual.textContent = formatarMoeda(resultados.custoTotalAnual);
  elementos.economiaEstimada.textContent = formatarMoeda(
    resultados.economiaAnual
  );
  elementos.roiFinal.textContent = formatarPercentual(resultados.roiSistema);

  const insights = gerarInsights(resultados);

  // Gera e exibe insights
  const insightsHTML = insights
    .map((insight, index) => {
      // Verifica se é o último item da lista
      const isLastItem = index === insights.length - 1;

      // Define o ícone: ⚠️ para o último, ✓ para os outros
      const icon = isLastItem ? '⚠️' : '✓';

      // Adiciona uma classe 'check' para o ícone de '✓' para podermos dar a cor verde
      const iconClass = isLastItem ? 'icon' : 'icon check';

      return `<li><span class="${iconClass}">${icon}</span><span>${insight}</span></li>`;
    })
    .join('');

  elementos.insightsContent.innerHTML = `<ul>${insightsHTML}</ul>`;

  // Aplica cores baseadas no ROI
  const roiElement = elementos.roiFinal;
  const roiContainer = roiElement.closest('.roi-highlight');

  if (resultados.roiSistema > 200) {
    roiContainer.style.background =
      'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
  } else if (resultados.roiSistema > 100) {
    roiContainer.style.background =
      'linear-gradient(135deg, #17a2b8 0%, #138496 100%)';
  } else if (resultados.roiSistema > 0) {
    roiContainer.style.background =
      'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)';
  } else {
    roiContainer.style.background =
      'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
  }

  // Mostra a seção de resultados com animação
  elementos.resultados.style.display = 'block';

  // Scroll suave para os resultados
  elementos.resultados.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

// ===== EVENTO PRINCIPAL =====

/**
 * Função principal executada no clique do botão calcular
 */
function executarCalculo() {
  // Validação dos inputs
  if (!validarInputs()) {
    return;
  }

  // Adiciona estado de loading
  elementos.calcularBtn.classList.add('loading');
  elementos.calcularBtn.disabled = true;

  // Simula processamento (melhor UX)
  setTimeout(() => {
    try {
      // Realiza os cálculos
      const resultados = calcularROI();

      // Exibe os resultados
      exibirResultados(resultados);

      // Log para debug (remover em produção)
      console.log('Resultados calculados:', resultados);
    } catch (error) {
      console.error('Erro no cálculo:', error);
      alert(
        'Ocorreu um erro no cálculo. Por favor, verifique os valores inseridos.'
      );
    } finally {
      // Remove estado de loading
      elementos.calcularBtn.classList.remove('loading');
      elementos.calcularBtn.disabled = false;
    }
  }, 500);
}

// ===== INICIALIZAÇÃO =====

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function () {
  // Adiciona event listener ao botão
  elementos.calcularBtn.addEventListener('click', executarCalculo);

  // Adiciona validação em tempo real aos inputs
  const todosInputs = Object.values(elementos).filter(
    (el) => el && el.type === 'number'
  );

  todosInputs.forEach((input) => {
    input.addEventListener('input', function () {
      // Remove valores negativos
      if (this.value < 0) {
        this.value = 0;
      }

      // Remove a classe de erro se o campo foi corrigido
      if (this.value && !isNaN(this.value)) {
        this.style.borderColor = '#e9ecef';
      }
    });

    // Permite cálculo com Enter em qualquer campo
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        executarCalculo();
      }
    });
  });

  // Adiciona máscara de moeda aos campos monetários
  const camposMonetarios = [
    elementos.salarioMensal,
    elementos.custoSistema,
    elementos.custoHoraRH,
    elementos.custoHoraGerente,
  ];

  camposMonetarios.forEach((campo) => {
    campo.addEventListener('blur', function () {
      if (this.value) {
        // Formata o valor no campo para melhor visualização
        const valor = parseFloat(this.value);
        this.setAttribute('data-value', valor);
      }
    });
  });

  // Log de inicialização
  console.log('Calculadora de ROI inicializada com sucesso!');
  console.log('Versão: 1.0.0');
  console.log('Desenvolvida para o mercado brasileiro de RH');
});

// ===== UTILITÁRIOS AVANÇADOS =====

/**
 * Exporta resultados para compartilhamento (funcionalidade futura)
 * @param {Object} resultados - Resultados dos cálculos
 */
function exportarResultados(resultados) {
  const dadosExport = {
    dataCalculo: new Date().toLocaleDateString('pt-BR'),
    taxaTurnover: resultados.taxaTurnover,
    custoUnitario: resultados.custoTotalUmDesligamento,
    custoAnual: resultados.custoTotalAnual,
    economiaAnual: resultados.economiaAnual,
    roiSistema: resultados.roiSistema,
    paybackMeses: resultados.paybackMeses,
  };

  console.log('Dados para export:', dadosExport);
  // Implementar funcionalidade de export (PDF, Excel, etc.) se necessário
}

/**
 * Função de reset da calculadora
 */
function resetarCalculadora() {
  // Reset dos campos para valores padrão
  elementos.multiplicadorEncargos.value = '1.67';
  elementos.custoHoraRH.value = '100';
  elementos.custoHoraGerente.value = '150';
  elementos.horasRecrutamento.value = '20';
  elementos.horasTreinamento.value = '40';
  elementos.reducaoTurnover.value = '30';

  // Limpa campos principais
  const camposPrincipais = [
    elementos.salarioMensal,
    elementos.totalColaboradores,
    elementos.totalDesligamentos,
    elementos.custoSistema,
  ];

  camposPrincipais.forEach((campo) => {
    campo.value = '';
    campo.style.borderColor = '#e9ecef';
  });

  // Esconde resultados
  elementos.resultados.style.display = 'none';
}

// ===== TRATAMENTO DE ERROS GLOBAIS =====

window.addEventListener('error', function (e) {
  console.error('Erro global capturado:', e.error);
  // Em produção, aqui você poderia enviar erros para um serviço de monitoramento
});

// ===== FEEDBACK VISUAL E ACESSIBILIDADE =====

/**
 * Melhora a acessibilidade com feedback visual
 */
function melhorarAcessibilidade() {
  // Adiciona aria-labels dinâmicos
  elementos.calcularBtn.setAttribute(
    'aria-label',
    'Calcular ROI do sistema de RH'
  );
  elementos.resultados.setAttribute('aria-live', 'polite');

  // Melhora navegação por teclado
  const elementosFocusaveis = document.querySelectorAll('input, button');
  elementosFocusaveis.forEach((el, index) => {
    el.setAttribute('tabindex', index + 1);
  });
}

// Chama melhorias de acessibilidade após carregamento
document.addEventListener('DOMContentLoaded', melhorarAcessibilidade);

// ===== ANALYTICS E TRACKING (OPCIONAL) =====

/**
 * Funcão para tracking de uso (opcional)
 * @param {string} evento - Nome do evento
 * @param {Object} dados - Dados do evento
 */
function trackEvent(evento, dados = {}) {
  // Implementar integração com Google Analytics, Mixpanel, etc.
  console.log(`Event: ${evento}`, dados);
}

// Exemplo de uso do tracking
elementos.calcularBtn.addEventListener('click', () => {
  trackEvent('calculo_iniciado', {
    timestamp: new Date().toISOString(),
  });
});
