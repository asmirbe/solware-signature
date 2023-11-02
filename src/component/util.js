let timer;
export function debounce(func, delay) {
	return function (...args) {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

export const lang = {
	1: "Ce message électronique et tous les fichiers qui y sont attachés sont confidentiels et destinés uniquement à la personne ou à l'entité à qui ils sont adressés. Si vous avez reçu ce message par erreur, veuillez en informer immédiatement l'expéditeur et supprimer ce message de votre système. Tout usage, divulgation, distribution ou reproduction de ce message est interdit.",
	2: "This email message and any files attached to it are confidential and intended only for the person or entity to whom they are addressed. If you received this message in error, please notify the sender immediately and delete this message from your system. Any use, disclosure, distribution or reproduction of this message is prohibited.",
	3: "Esta mensagem de e-mail e quaisquer arquivos a ela anexados são confidenciais e destinam-se apenas à pessoa ou entidade a quem são endereçados. Se você recebeu esta mensagem por engano, notifique o remetente imediatamente e exclua esta mensagem do seu sistema. É proibida qualquer utilização, divulgação, distribuição ou reprodução desta mensagem.",
	4: "Este mensaje de correo electrónico y cualquier archivo adjunto a él son confidenciales y están destinados únicamente a la persona o entidad a quien están dirigidos. Si recibió este mensaje por error, notifique al remitente inmediatamente y elimine este mensaje de su sistema. Cualquier uso, divulgación, distribución o reproducción de este mensaje está prohibido.",
	5: "Questo messaggio e-mail e tutti i file ad esso allegati sono riservati e destinati esclusivamente alla persona o entità a cui sono indirizzati. Se hai ricevuto questo messaggio per errore, avvisa immediatamente il mittente ed elimina questo messaggio dal tuo sistema. Qualsiasi utilizzo, divulgazione, distribuzione o riproduzione di questo messaggio è proibito.",
};
