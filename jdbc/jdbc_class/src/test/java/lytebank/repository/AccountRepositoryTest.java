package lytebank.repository;

import lytebank.db.DatabaseConnectionManager;
import lytebank.exceptions.AccountNotFoundException;
import lytebank.model.Account;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.sql.Connection;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class AccountRepositoryTest {
    @Test
    void testGetAccountById() {
        Integer id = 1;
        Connection connection = DatabaseConnectionManager.getInstance().getDatabaseConnection();
        AccountRepository accountRepository = new AccountRepository();
        Optional<Account> foundAccount = accountRepository.findById(connection, id);
        Account account = foundAccount.orElseThrow(() -> new AccountNotFoundException("Account not found"));

        assertNotNull(account);
        assertEquals(new BigDecimal("1000.00"), account.getBalance());
    }

    @Test
    void testGetAccountByIdNotFound() {
        Integer id = 2;
        Connection connection = DatabaseConnectionManager.getInstance().getDatabaseConnection();
        AccountRepository accountRepository = new AccountRepository();
        Optional<Account> foundAccount = accountRepository.findById(connection, id);
        assertThrows(AccountNotFoundException.class, () -> foundAccount.orElseThrow(() -> new AccountNotFoundException("Account not found")));
    }

    @Test
    void canUpdateAccountTest(){
        Integer id = 1;
        BigDecimal balance = new BigDecimal("10000.00");

        Connection connection = DatabaseConnectionManager.getInstance().getDatabaseConnection();
        AccountRepository accountRepository = new AccountRepository();
        accountRepository.updateAccount(connection, id, balance);
        Optional<Account> foundAccount = accountRepository.findById(connection, id);
        Account account = foundAccount.orElseThrow(() -> new AccountNotFoundException("Account not found"));
        assertEquals(balance, account.getBalance());
    }
}
