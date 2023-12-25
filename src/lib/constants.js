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
	infosTitle: "Infos",
	infosRgpd: "En acceptant ce formulaire, j'accepte que les informations saisies soient exploitées dans le cadre de la démo et de la relation commerciale qui peut en découler.",
	infosText: `
	<p>Je m'engage à protéger votre vie privée : mon application de signatures email ne conserve que votre avatar, dans le respect strict de la sécurité et de la confidentialité. Si vous souhaitez le faire supprimer, contactez-moi en transférant votre token utilisateur, tout simplement.</p>
	<p>Aucune autre donnée personnelle n'est collectée ou stockée. La confiance que vous m'accordez est primordiale, et je suis déterminé à assurer la sécurité de vos informations.</p>
	<p>Cette application a été conçue par <a href="https://www.hiasmir.com" target="_blank"><b>Asmir Belkic</b></a> au nom de Solware. Pour toute question ou demande, je vous invite à me joindre via Teams.</p>`,
};

export const lang = {
	1: "Ce message électronique et tous les fichiers qui y sont attachés sont confidentiels et destinés uniquement à la personne ou à l'entité à qui ils sont adressés. Si vous avez reçu ce message par erreur, veuillez en informer immédiatement l'expéditeur et supprimer ce message de votre système. Tout usage, divulgation, distribution ou reproduction de ce message est interdit.",
	2: "This email message and any files attached to it are confidential and intended only for the person or entity to whom they are addressed. If you received this message in error, please notify the sender immediately and delete this message from your system. Any use, disclosure, distribution or reproduction of this message is prohibited.",
	3: "Esta mensagem de e-mail e quaisquer arquivos a ela anexados são confidenciais e destinam-se apenas à pessoa ou entidade a quem são endereçados. Se você recebeu esta mensagem por engano, notifique o remetente imediatamente e exclua esta mensagem do seu sistema. É proibida qualquer utilização, divulgação, distribuição ou reprodução desta mensagem.",
	4: "Este mensaje de correo electrónico y cualquier archivo adjunto a él son confidenciales y están destinados únicamente a la persona o entidad a quien están dirigidos. Si recibió este mensaje por error, notifique al remitente inmediatamente y elimine este mensaje de su sistema. Cualquier uso, divulgación, distribución o reproducción de este mensaje está prohibido.",
	5: "Questo messaggio e-mail e tutti i file ad esso allegati sono riservati e destinati esclusivamente alla persona o entità a cui sono indirizzati. Se hai ricevuto questo messaggio per errore, avvisa immediatamente il mittente ed elimina questo messaggio dal tuo sistema. Qualsiasi utilizzo, divulgazione, distribuzione o riproduzione di questo messaggio è proibito.",
};

export let addressOptions = [
	{ id: 0, name: "France", value: `68 bis Chem. du Moulin Carron <br/> 69570 Dardilly` },
	{ id: 1, name: "Maroc", value: "108, bd Ghandi, résid. Ghandi imm.I n°20 - 20100 Casablanca" },
	{ id: 2, name: "Algerie", value: "Cité 1200 logements, Coopérative Granitex BT 2 n° 07, Bab Ezzouar 16025, Algérie" },
	{ id: 3, name: "Italie", value: "Via Leone XIII n°14 - 20145 Milano (MI)" },
	{ id: 4, name: "Espagne", value: "Calle María Teresa, 17 - 3ªA Madrid 28028 - España" },
];

export let langOptions = [
	{ id: 0, name: "Aucun", default:true },
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
	warning: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0"><path d="M12 8.5V14m0 3.247v-.5m-6.02-5.986C8.608 5.587 9.92 3 12 3c2.08 0 3.393 2.587 6.02 7.761l.327.645c2.182 4.3 3.274 6.45 2.287 8.022C19.648 21 17.208 21 12.327 21h-.654c-4.88 0-7.321 0-8.307-1.572-.987-1.572.105-3.722 2.287-8.022l.328-.645Z"></path></svg>`,
	info: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0"><path d="M12 16v-5h-.5m0 5h1M12 8.5V8"></path><circle cx="12" cy="12" r="9"></circle></svg>`,
	danger: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
`,
	bin: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600"><path d="M6.286 8.571 7.429 20h9.142l1.143-11.429M13.5 15.5v-5m-3 5v-5M4.571 6.286h4.572m0 0 .382-1.529a1 1 0 0 1 .97-.757h3.01a1 1 0 0 1 .97.757l.382 1.529m-5.714 0h5.714m0 0h4.572"></path></svg>`,
	success: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600"><path d="m8.667 12.333 1.505 1.721a1 1 0 0 0 1.564-.073L15.333 9"></path><circle cx="12" cy="12" r="9"></circle></svg>`,
	reset: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path></svg>`,
};
