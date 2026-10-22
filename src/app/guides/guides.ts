import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallVideo } from '../install-video/install-video';

@Component({
  selector: 'app-guides',
  imports: [RouterLink, InstallVideo],
  templateUrl: './guides.html',
  styleUrl: './guides.css',
})
export class Guides {
  // Ostujuhend: mida kontrollida enne ostmist (praeguselt lehelt wpc.ee/ostujuhend)
  ostujuhend = [
    { title: 'Sobib ainult 3D aiapaneelile', text: 'Paneelaedu me ei müü, see peaks sul juba olemas olema. Soovi korral soovitame koostööpartnereid, kellelt paneelaia saad.' },
    { title: 'Silm 50 × 200 mm', text: 'Lipid sobivad paneelidele, mille silm on 50 × 200 mm ja vertikaalsete traatide vahe vähemalt 45 mm. Traat võib olla 3, 4 või 5 mm.' },
    { title: 'Vähemalt 1 cm maapinnast', text: 'Paneeli ja maapinna (või alusplaadi) vahele peab jääma vähemalt 1 cm alumise profiili jaoks.' },
    { title: 'Vahel tuleb lõigata', text: 'Aiapaneeli paigalduse eripära tõttu võib olla vaja üksikuid lippe lõigata. Selleks sobivad tavalised puidutööriistad.' },
    { title: '1 komplekt = 1 paneel', text: 'Üks komplekt katab ühe 2,5 m pikkuse aiapaneeli. Loe kokku, mitu paneeli soovid katta. Komplekte müüme tervikuna ega poolita.' },
    { title: 'Tarneaeg ja ettemaks', text: 'Kui toodet laos pole, võib tarneaeg olla kuni paar kuud. Tellimisel võtame ettemaksu 50% kogusummast.' },
  ];

  // Paigaldusjuhend: sammud koos joonistega (praeguselt lehelt wpc.ee/paigaldamine)
  sammud = [
    { title: 'Planeeri muster', pildid: ['images/guide/patterns.jpg'], punktid: [
      'Mõtle läbi, millist mustrit soovid: kombineeri värve, punu lippe erinevas stiilis või paigalda lipid üle ühe.',
      'Tee enne paberil visand, siis ei pea hiljem ümber tegema.' ] },
    { title: 'Äärelipid ja V-profiilid', pildid: ['images/guide/step-2a.jpg', 'images/guide/step-2b.jpg', 'images/guide/step-2c.jpg'], punktid: [
      'Kontrolli sobivust: lõika äärmised lipid aiapaneeli kinnitusklambrite kohalt sobivaks. Sobivad kodused puidutööriistad: käsisaag, näpitsad või nuga.',
      'Paigalda äärelipid paneeli mõlemasse otsa.',
      'Paigalda paneeli vasakule poolele ülemine, keskmine ja alumine V-profiil.',
      'Fikseeri V-profiilid, lisades nende lõppu (paneeli keskele) ühe 44 mm lipi.',
      'Korda sama paneeli paremal poolel.' ] },
    { title: 'Ülejäänud lipid', pildid: ['images/guide/step-3.jpg'], punktid: [
      'Paigalda ülejäänud 44 mm laiused WPC lipid.',
      'Jälgi, et kõik lipid oleksid ühel kõrgusel: aiapaneeli traatide tippudest kuni alumise profiili ääreni.',
      'Liiga pika lipi saad puidutööriistaga lühemaks lõigata.' ] },
    { title: 'Alumised profiilid', pildid: ['images/guide/step-4.jpg'], punktid: [
      'Paneeli ja maapinna vahele peab jääma vähemalt 1 cm.',
      'Lükka vasak ja parem alumine profiil alt üles, nii et see kataks paneeli ja lippide ääred.',
      'Profiil peab lukustuma kõige alumise horisontaalse traadi taha.' ] },
    { title: 'Ülemised profiilid', pildid: ['images/guide/step-5.jpg'], punktid: [
      'Lükka vasak ja parem ülemine profiil ülevalt alla, nii et see kataks paneeli ja lippide ääred.',
      'Profiil peab lukustuma kõige ülemise horisontaalse traadi taha.' ] },
    { title: 'Nii lihtne ongi', pildid: [], punktid: [
      'Korda samme 2–5, kuni kogu paneelaed on kaetud.',
      'Ühe paneeli katmine võtab 30–45 minutit, olenevalt aia kõrgusest.' ] },
  ];
}
