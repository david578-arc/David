package com.examly.springapp;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import java.io.File;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
class SpringappPlayerTests {

    @Autowired
    private MockMvc mockMvc;

    // ---------- Core API Tests ----------
    @Order(1)
    @Test
    void AddPlayerReturns200() throws Exception {
        String playerData = """
                {
                    "playerName": "Lionel Messi",
                    "country": "Argentina",
                    "position": "Forward",
                    "age": 36,
                    "goals": 700
                }
                """;

        mockMvc.perform(post("/api/players/addPlayer")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(playerData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Order(2)
    @Test
    void GetAllPlayersReturnsArray() throws Exception {
        mockMvc.perform(get("/api/players/allPlayers")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andReturn();
    }

    @Order(3)
    @Test
    void GetPlayerByIdReturns200() throws Exception {
        mockMvc.perform(get("/api/players/1")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerName").exists())
                .andReturn();
    }

    @Order(4)
    @Test
    void UpdatePlayerReturns200() throws Exception {
        String updatedData = """
                {
                    "playerName": "Lionel Messi",
                    "country": "Argentina",
                    "position": "Forward",
                    "age": 37,
                    "goals": 710
                }
                """;

        mockMvc.perform(put("/api/players/1")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedData)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.age").value(37))
                .andReturn();
    }

    @Order(5)
    @Test
    void DeletePlayerReturns200() throws Exception {
        mockMvc.perform(delete("/api/players/1")
                        .with(jwt())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }

    // ---------- Project Structure Tests ----------
    @Test
    void ControllerDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/controller";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void PlayerControllerFileExists() {
        String filePath = "src/main/java/com/examly/springapp/controller/PlayerController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void ModelDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/model";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void PlayerModelFileExists() {
        String filePath = "src/main/java/com/examly/springapp/model/Player.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void RepositoryDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/repository";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void ServiceDirectoryExists() {
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void PlayerServiceClassExists() {
        checkClassExists("com.examly.springapp.service.PlayerService");
    }

    @Test
    void PlayerModelClassExists() {
        checkClassExists("com.examly.springapp.model.Player");
    }

    @Test
    void PlayerModelHasPlayerNameField() {
        checkFieldExists("com.examly.springapp.model.Player", "playerName");
    }

    @Test
    void PlayerModelHasCountryField() {
        checkFieldExists("com.examly.springapp.model.Player", "country");
    }

    @Test
    void PlayerModelHasPositionField() {
        checkFieldExists("com.examly.springapp.model.Player", "position");
    }

    @Test
    void PlayerModelHasAgeField() {
        checkFieldExists("com.examly.springapp.model.Player", "age");
    }

    @Test
    void PlayerModelHasGoalsField() {
        checkFieldExists("com.examly.springapp.model.Player", "goals");
    }

    @Test
    void PlayerRepoExtendsJpaRepository() {
        checkClassImplementsInterface("com.examly.springapp.repository.PlayerRepository",
                "org.springframework.data.jpa.repository.JpaRepository");
    }

    @Test
    void PlayerNotFoundExceptionClassExists() {
        checkClassExists("com.examly.springapp.exception.PlayerNotFoundException");
    }

    @Test
    void PlayerNotFoundExceptionExtendsRuntimeException() {
        try {
            Class<?> clazz = Class.forName("com.examly.springapp.exception.PlayerNotFoundException");
            assertTrue(RuntimeException.class.isAssignableFrom(clazz),
                    "PlayerNotFoundException should extend RuntimeException");
        } catch (ClassNotFoundException e) {
            fail("PlayerNotFoundException class does not exist.");
        }
    }

    // ---------- Helpers ----------
    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " in class " + className + " does not exist.");
        }
    }

    private void checkClassImplementsInterface(String className, String interfaceName) {
        try {
            Class<?> clazz = Class.forName(className);
            Class<?> interfaceClazz = Class.forName(interfaceName);
            assertTrue(interfaceClazz.isAssignableFrom(clazz));
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " or interface " + interfaceName + " does not exist.");
        }
    }
}
