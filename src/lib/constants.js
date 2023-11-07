export const userCallCounts = {}; // This will store how many times each user has called the function
export const callLimitPerUser = 5; // For example, let's limit to 5 calls per user
export const timeWindow = 600000; // 360 000 = 1 hour | 600000 = 10min

{
	/* <ol>
<li>Remplissez les informations demandées pour la création de votre signature électronique.</li>
<li>Une fois la signature générée, sélectionnez et copiez l'intégralité du contenu.</li>
<li>Collez le contenu copié dans l'espace dédié à la signature électronique de votre client de messagerie.</li>
</ol> */
}

export const txtApp = {
	checkboxRgpd: "J'accepte les conditions général d'utilisation.",
	infosTitle: "👀 Infos",
	infosRgpd: "En acceptant ce formulaire, j'accepte que les informations saisies soient exploitées dans le cadre de la démo et de la relation commerciale qui peut en découler.",
	infosText: `
	<p>Je m'engage à protéger votre vie privée : mon application de signatures email ne conserve que votre avatar, dans le respect strict de la sécurité et de la confidentialité. Si vous souhaitez le faire supprimer, contactez-moi en transférant votre token utilisateur, tout simplement.</p>
	<p>Aucune autre donnée personnelle n'est collectée ou stockée. La confiance que vous m'accordez est primordiale, et je suis déterminé à assurer la sécurité de vos informations.</p>
	<p>Ce site a été créé par <a href="https://www.hiasmir.com" target="_blank"><b>Asmir Belkic</b></a> pour Solware. Si vous avez des questions ou une demande, n'hésitez pas à me contacter par Teams.</p>`,
};

export const lang = {
	1: "Ce message électronique et tous les fichiers qui y sont attachés sont confidentiels et destinés uniquement à la personne ou à l'entité à qui ils sont adressés. Si vous avez reçu ce message par erreur, veuillez en informer immédiatement l'expéditeur et supprimer ce message de votre système. Tout usage, divulgation, distribution ou reproduction de ce message est interdit.",
	2: "This email message and any files attached to it are confidential and intended only for the person or entity to whom they are addressed. If you received this message in error, please notify the sender immediately and delete this message from your system. Any use, disclosure, distribution or reproduction of this message is prohibited.",
	3: "Esta mensagem de e-mail e quaisquer arquivos a ela anexados são confidenciais e destinam-se apenas à pessoa ou entidade a quem são endereçados. Se você recebeu esta mensagem por engano, notifique o remetente imediatamente e exclua esta mensagem do seu sistema. É proibida qualquer utilização, divulgação, distribuição ou reprodução desta mensagem.",
	4: "Este mensaje de correo electrónico y cualquier archivo adjunto a él son confidenciales y están destinados únicamente a la persona o entidad a quien están dirigidos. Si recibió este mensaje por error, notifique al remitente inmediatamente y elimine este mensaje de su sistema. Cualquier uso, divulgación, distribución o reproducción de este mensaje está prohibido.",
	5: "Questo messaggio e-mail e tutti i file ad esso allegati sono riservati e destinati esclusivamente alla persona o entità a cui sono indirizzati. Se hai ricevuto questo messaggio per errore, avvisa immediatamente il mittente ed elimina questo messaggio dal tuo sistema. Qualsiasi utilizzo, divulgazione, distribuzione o riproduzione di questo messaggio è proibito.",
};

export let langOptions = [
	{ id: 0, name: "Aucun" },
	{ id: 1, name: "Français" },
	{ id: 2, name: "Anglais" },
	{ id: 3, name: "Portugais" },
	{ id: 4, name: "Espagnol" },
	{ id: 5, name: "Italien" },
];

export let brandOptions = [
	{ id: 0, name: "Solware", link: "https://solware.fr/", badge: "Holding", badgeColor: "red" },
	{ id: 1, name: "Solware Auto", link: "https://winmotornext.com/", badge: "WinMotor Next", badgeColor: "blue" },
];

export const notificationIcon = {
	warning: `<path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>`,
	info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path>`,
	danger: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"></path>`,
	success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path>`,
};
