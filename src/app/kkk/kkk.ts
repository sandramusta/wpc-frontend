import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-kkk',
  imports: [RouterLink],
  templateUrl: './kkk.html',
  styleUrl: './kkk.css',
})
export class Kkk {
  kysimused = [
    { k: 'Kas WPC lipid sobivad minu aiale?', v: 'Sobivad 3D aiapaneelidele, mille silm on 50 × 200 mm ja vertikaalsete traatide vahe vähemalt 45 mm. Traat võib olla 3, 4 või 5 mm. Paneeli ja maapinna (või alusplaadi) vahele peab jääma vähemalt 1 cm alumise profiili jaoks.' },
    { k: 'Mitu komplekti mul vaja on?', v: 'Üks komplekt katab ühe 2,5 m pikkuse aiapaneeli. Loe kokku, mitu paneeli soovid katta. Kõiki paneele katma ei pea: võid katta ainult maja ees olevad või iga teise.' },
    { k: 'Mis on komplektis?', v: '50 WPC lippi (44 × 4,1 mm), PVC V-profiilid ning ülemine ja alumine PVC profiil, kumbki 2 tk. 3D võrkpaneel komplekti ei kuulu.' },
    { k: 'Kas saan ise paigaldada?', v: 'Jah. Eritööriistu pole vaja ja ühe paneeli katmine võtab 30–45 minutit. Vahel tuleb üksikuid lippe lõigata, selleks sobivad tavalised puidutööriistad. Kui aega pole, pakume ka paigaldust: tavaliselt või punutud stiilis.' },
    { k: 'Mis värvid on?', v: 'Tumehall ja pruun, harjatud tekstuuriga. Värve saab kombineerida ja lippe saab paigaldada ka üle ühe.' },
    { k: 'Kas lipid vajavad hooldust?', v: 'Ei vaja värvimist, peitsimist ega muud töötlemist. Pesta saab survepesuriga (mitte väga lähedalt) ja seebiveega.' },
    { k: 'Kas lipid pleegivad?', v: 'Võivad natuke pleekida, aga vähe. TTÜ katses muutus värv 2000 tunni tugeva UV-kiirguse järel nii vähe, et seda märkab ainult lähedalt ja kõrvutades vaadates.' },
    { k: 'Kas lipid kolisevad tuulega?', v: 'Ei. Lipid on paneeli küljes tihedalt kinni, ei tee häält ja annavad ka tuuletõkke.' },
    { k: 'Kui pikk on garantii?', v: '24 kuud alates üleandmisest. Garantii ei kata valest paigaldusest või hooldusest tekkinud kahju, transpordikahjustusi ega tavalist kulumist. Pretensioon kirjalikult aadressile info@wpc.ee.' },
    { k: 'Kuidas kaup minuni jõuab?', v: 'Saadame Venipakiga või tuled ise järele Haaslavasse (Pihlaka tee 33). Kui toodet laos pole, võib tarneaeg olla kuni paar kuud.' },
    { k: 'Kas saan maksta osade kaupa?', v: 'Jah, ESTO kaudu, ka ettevõttena. ESTO 3-ga jagad summa kolmeks võrdseks osaks ilma lisatasuta.' },
  ];
}
