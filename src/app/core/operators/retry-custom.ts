import { Observable, of, throwError } from 'rxjs';
import { retryWhen, mergeMap, delay, finalize} from 'rxjs/operators';


export function delayedRetry(delayMs: number, maxRetry = 3) {
    let  retries = maxRetry;
    return (src: Observable<any>) =>
    src.pipe(
        retryWhen((err: Observable<any>) =>
        err.pipe(
            delay(delayMs),
            mergeMap(error => retries-- > 0 ? of(error) : throwError('Tried but failed after ' + maxRetry + ' tries')),
            finalize(
                () => {
                  console.log('finalize block excuted');
                }
              ))
        )
    );
}

