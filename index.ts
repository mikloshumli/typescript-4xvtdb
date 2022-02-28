import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import './style.css';

console.clear();

let btn1El: HTMLElement = document.getElementById('btn-01');
let messageEl: HTMLElement = document.getElementById('message');

if (btn1El && messageEl) {
  let subject = new Subject();

  let observable: Observable<number> = new Observable((observer) => {
    let count: number = 0;
    let counter: number | null;

    let eventClickListener = () => {
      if (!counter) {
        counter = setInterval(() => {
          count++;
          messageEl.innerHTML = 'Feliratkoztak rám';
          messageEl.classList.add('text-success');
          btn1El.innerHTML = `Számláló ${count}`;
          observer.next(count);
          if (count === 5) {
            observer.error('Öt emittálás után hibát dobtam');
          }
        }, 500);
      } else {
        clearInterval(counter);
        count = 0;
        counter = null;
      }
    };

    btn1El.addEventListener('click', eventClickListener);

    /*
    vége az életciklusnak (hiba, leiratkozás vagy complete eseményeknél)
    */
    return () => {
      messageEl.classList.add('text-danger');
      messageEl.classList.remove('text-success');
      messageEl.innerHTML = 'vége az életciklusomnak';
      btn1El.removeEventListener('click', eventClickListener);
      clearInterval(counter);
    };
  });

  observable.subscribe(subject);

  /*
  Semmit nem csinálok a logolás és feliratkozáson kívül
  */
  let subscription1 = subject
    .pipe(tap((res) => console.log('subscription1 emit', res)))
    .subscribe(
      (res: number) => {
        // itt is logolhatok
      },
      (err) => {
        console.log('subscription1 error:', err);
      },
      () => {
        console.log('Complete');
      }
    );

  /*
  Minden értékhez hozzáadok kettőt és
  csak a páratlanokat engedem tovább
  */
  let subscription2 = subject
    .pipe(
      map((res: number) => res + 2),
      filter((res) => res % 2 === 1),
      tap((res) => console.log('subscription2 emit', res))
    )
    .subscribe(
      (res: number) => {
        // itt is logolhatok
      },
      (err) => {
        console.log('subscription2 error:', err);
      },
      () => {
        console.log('Complete');
      }
    );
}
