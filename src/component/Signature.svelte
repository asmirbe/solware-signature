<script>
	import user from "$lib/store";
	import { fade } from "svelte/transition";
	import { isLoading, signLoading } from "$lib/store";
	import Image from "$components/Image.svelte";
	import { lang, brandOptions, addressOptions } from "$lib/constants";
	import { checkImageUrl } from "$lib/util";

	$: selectedLink = brandOptions.find((brand) => brand.id === $user.preferences.brand) || brandOptions[0];

</script>

<table transition:fade={{ duration: 200 }} width="600" cellspacing="0" cellpadding="0" border="0" style="padding: 32px 0;font-size:13px;font-weight: 500;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
	<tbody>
		<tr>
			{#if $user.personalInfo.pictureUrl || $isLoading === true}
				<td width="100" style="vertical-align:top;padding:0 1em;">
					<Image isLoading={$isLoading} src={$user.personalInfo.pictureUrl} alt="avatar" style="width: 100px; height: 100px; border-radius: 10px; border:none" />
				</td>
				<td style="border-left:solid #eaecf0 1px" width="16" />
			{/if}
			<td style="vertical-align: top; text-align:left;color:#000000; text-align:left">
				<div style="orphans: 2; widows: 2;">
					<span style="padding-top: 10px; line-height:16px; color:#000000;font-size:15px;">
						<b>{$user.personalInfo.name}</b>
					</span>
					{#if $user.personalInfo.contact.linkedin}
						<a href={$user.personalInfo.contact.linkedin} target="_blank" rel="noreferrer" data-external="true">
							<img width="16" alt="social icon linkedin" style="border:none;vertical-align:bottom;margin-left:6px;" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/o86mwkuj02awbnh4nryv.png" />
						</a>
					{/if}
				</div>
				<div style="orphans: 2; widows: 2;">
					<span style="line-height: 1.8;color:#4C4C4C; font-weight:500;">
						{$user.personalInfo.position} •
						<a href={selectedLink.link} data-external="true" style="text-decoration:none !important;color:#0079fe;font: 600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; !important;">
							<span style="text-decoration:none;color:#0079fe;font-weight: 600 !important;">{selectedLink.name}</span>
						</a>
					</span>
				</div>
				<div style="orphans: 2; widows: 2;">
					<span
						style="color:#8C8C8C; line-height: 1.6; margin: 6px 0; display:inline-block;     font-size: 13px;
									font-weight: 500;"
					>
						{@html addressOptions[$user.preferences.address]?.value}
						<!-- 68 bis Chem. du Moulin Carron
						<br />
						69570 Dardilly -->
					</span>
				</div>
				<div style="orphans: 2; widows: 2;">
					{#if $user.features.bookACall}
						<a href={$user.features.bookACall} rel="noreferrer" target="_blank" style="max-width:260px;display: block;padding: .65em 1em;margin: 6px 0;text-align: center;text-decoration:none;color: white;font-weight: bold;border-radius: 6px;background-color: #0079fe;border: 1px solid rgba(0, 0, 0, .1);">Schedule 15 minutes with me</a>
					{/if}
					{#if $user.personalInfo.contact.phone}
						<span style="color:#8C8C8C!important;margin: 6px 0 0;">
							<a href="tel:{$user.personalInfo.contact.phone}" data-external="true" style="text-decoration:none !important;color: rgb(140, 140, 140);">
								<span style="text-decoration: none;color: #4c4c4c; line-height: 1.5;">{$user.personalInfo.contact.phone}</span>
							</a>
							{#if $user.preferences.mobilePhoneCheckbox && $user.personalInfo.contact.mobilePhone.length}
								•
								<a href="tel:{$user.personalInfo.contact.mobilePhone}" data-external="true" style="text-decoration:none !important;color: rgb(140, 140, 140);">
									<span style="text-decoration: none;color: #4c4c4c; line-height: 1.5;">{$user.personalInfo.contact.mobilePhone}</span>
								</a>
							{/if}
						</span>
					{/if}
					{#if $user.personalInfo.contact.email}
						<a href="mailto:{$user.personalInfo.contact.email}" data-external="true" style="display: block; text-decoration:none !important;color: rgb(140, 140, 140);">
							<span style="text-decoration:none;color: rgb(140, 140, 140); line-height: 1.5;">{$user.personalInfo.contact.email}</span>
						</a>
					{/if}
				</div>
				<table cellpadding="0" border="0" style="vertical-align:top; padding-top: 12px; border-collapse: initial; {checkImageUrl($user.features.banner.link) || $user.advert ? 'padding-bottom: 8px;' : ''}">
					<tbody>
						<tr>
							<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
								<a href="https://www.facebook.com/solwareauto/" target="_blank" rel="noreferrer" data-external="true">
									<img width="50%" alt="social icon facebook" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698764174/exe3v7typk2ljoaxlrwu.png" />
								</a>
							</td>
							<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
								<a href="https://www.youtube.com/@solwaregroup" target="_blank" rel="noreferrer" data-external="true">
									<img width="50%" alt="social icon youtube" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/wbuzww8stmff3v26ruvv.png" />
								</a>
							</td>
							<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
								<a href="https://twitter.com/solwareauto" target="_blank" rel="noreferrer" data-external="true">
									<img width="50%" alt="social icon twitter" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/uxuaujbvbwg7bcecxpqq.png" />
								</a>
							</td>
							<td style="font-size: 12px; font-weight: bold; vertical-align: middle;">
								<a href="https://www.linkedin.com/company/solware-auto/" target="_blank" rel="noreferrer" data-external="true">
									<img width="50%" alt="social icon linkedin" style="border:none" src="https://res.cloudinary.com/dshtbs5hm/image/upload/v1698763890/o86mwkuj02awbnh4nryv.png" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
				{#if checkImageUrl($user.features.banner.image) && $user.features.banner.visible}
					<a href={$user.features.banner.link ? $user.features.banner.link : null} style="display:block; margin-top: 1em; {$user.features.banner.visible ? 'margin-bottom: 6px;' : ''}">
						<Image srcBanner={$user.features.banner.image} banner="true" alt="bannière d'annonce" style="border-radius:10px;{$user.features.banner.border ? 'border: 1px solid #ddd;' : ''}" />
					</a>
				{/if}
				{#if $user.preferences.advert != 0}
					<span style="font-size: 10px; line-height: 14px; color: #aaa;margin-top: .75em; display: inline-block;">CONFIDENTIALITY NOTICE — {lang[$user.preferences.advert]}</span>
				{/if}
			</td>
		</tr>
	</tbody>
</table>
