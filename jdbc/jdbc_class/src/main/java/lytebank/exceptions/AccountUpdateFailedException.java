package lytebank.exceptions;

public class AccountUpdateFailedException extends RuntimeException {
    public AccountUpdateFailedException(String message) {
        super(message);
    }
}
