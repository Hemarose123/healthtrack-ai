import Types "../types/auth";
import List "mo:core/List";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Principal "mo:core/Principal";

module {
  public type User = Types.User;
  public type UserProfile = Types.UserProfile;

  // Convert mutable User to shared-safe UserProfile
  public func toProfile(self : User) : UserProfile {
    {
      id = self.id;
      basicInfo = self.basicInfo;
      healthProfile = self.healthProfile;
      lifestyle = self.lifestyle;
      registrationStep = self.registrationStep;
      createdAt = self.createdAt;
      lastLogin = self.lastLogin;
    };
  };

  // Hash password using SHA-256 (deterministic)
  public func hashPassword(password : Text) : Text {
    let bytes = password.encodeUtf8();
    let digest = sha256(bytes);
    toHex(digest);
  };

  public func verifyPassword(password : Text, storedHash : Text) : Bool {
    hashPassword(password) == storedHash;
  };

  public func findByEmail(users : List.List<User>, email : Text) : ?User {
    users.find(func(u) { u.basicInfo.email == email });
  };

  public func findById(users : List.List<User>, userId : Principal) : ?User {
    users.find(func(u) { Principal.equal(u.id, userId) });
  };

  // BMI = weight(kg) / (height(m))^2
  public func calculateBmi(weightKg : Float, heightCm : Float) : Float {
    if (heightCm == 0.0) return 0.0;
    let heightM = heightCm / 100.0;
    weightKg / (heightM * heightM);
  };

  // Basic email validation: must contain '@' and '.'
  public func isValidEmail(email : Text) : Bool {
    email.contains(#char '@') and email.contains(#char '.');
  };

  // ── Internal helpers ──────────────────────────────────────────────────────────

  private func toHex(blob : Blob) : Text {
    let hexChars = "0123456789abcdef".toArray();
    var result = "";
    for (byte in blob.vals()) {
      let hi = byte.toNat() / 16;
      let lo = byte.toNat() % 16;
      result #= Text.fromChar(hexChars[hi]);
      result #= Text.fromChar(hexChars[lo]);
    };
    result;
  };

  // 2^n for small n (used for bit-length encoding)
  private func pow2(n : Nat) : Nat {
    var result = 1;
    var i = 0;
    while (i < n) { result *= 2; i += 1 };
    result;
  };

  // Rotate right 32-bit
  private func rotr32(x : Nat32, n : Nat32) : Nat32 {
    (x >> n) | (x << (32 - n));
  };

  // SHA-256 round constants
  private let kConst : [Nat32] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  public func sha256(data : Blob) : Blob {
    let msgBytes = data.toArray();
    let msgLen = msgBytes.size();
    // bit length as 8 bytes big-endian (only lower 32 bits of bit-length used for typical passwords)
    let bitLen : Nat = msgLen * 8;

    // Padding: append 0x80, zeros, then 8-byte big-endian length; total ≡ 0 mod 64
    // We need: (msgLen + 1 + zeroPadLen + 8) % 64 == 0
    // i.e. zeroPadLen = (55 - msgLen % 64 + 64) % 64
    let zeroPadLen : Nat = (55 + 64 - msgLen % 64) % 64;
    let totalLen = msgLen + 1 + zeroPadLen + 8;

    let msg = Array.tabulate<Nat8>(
      totalLen,
      func(i) {
        if (i < msgLen) {
          msgBytes[i];
        } else if (i == msgLen) {
          0x80;
        } else if (i < msgLen + 1 + zeroPadLen) {
          0x00;
        } else {
          // 8-byte big-endian bit length — we only need bytes for passwords < 512MB
          let bytePos : Nat = if (i >= msgLen + 1 + zeroPadLen) { i - (msgLen + 1 + zeroPadLen) } else { 0 };
          // bytes 0-3: upper 32 bits of bitLen (always 0 for small inputs)
          // bytes 4-7: lower 32 bits
          // 8-byte big-endian encoding of bitLen
          // For passwords, bitLen fits in lower 4 bytes (bytes 4-7); bytes 0-3 are 0
          if (bytePos < 4) {
            0x00;
          } else {
            // bytePos in [4..7], extract byte (7-bytePos)*8 from bitLen
            let shift : Nat = if (bytePos <= 7) { (7 - bytePos) * 8 } else { 0 };
            // Use repeated division to extract the byte at position 'shift'
            Nat8.fromNat(bitLen / pow2(shift) % 256);
          };
        };
      },
    );

    // Initial hash values (first 32 bits of fractional parts of square roots of first 8 primes)
    var h0 : Nat32 = 0x6a09e667;
    var h1 : Nat32 = 0xbb67ae85;
    var h2 : Nat32 = 0x3c6ef372;
    var h3 : Nat32 = 0xa54ff53a;
    var h4 : Nat32 = 0x510e527f;
    var h5 : Nat32 = 0x9b05688c;
    var h6 : Nat32 = 0x1f83d9ab;
    var h7 : Nat32 = 0x5be0cd19;

    let numBlocks = totalLen / 64;
    var blockIdx = 0;
    while (blockIdx < numBlocks) {
      // Build message schedule
      let wm = Array.tabulate(
        64,
        func(i) {
          if (i < 16) {
            let base = blockIdx * 64 + i * 4;
            (Nat32.fromNat(msg[base].toNat()) << 24) |
            (Nat32.fromNat(msg[base + 1].toNat()) << 16) |
            (Nat32.fromNat(msg[base + 2].toNat()) << 8) |
            Nat32.fromNat(msg[base + 3].toNat());
          } else {
            0 : Nat32;
          };
        },
      );
      let w = wm.toVarArray();
      var i = 16;
      while (i < 64) {
        let s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ (w[i - 15] >> 3);
        let s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ (w[i - 2] >> 10);
        w[i] := w[i - 16] +% w[i - 7] +% s0 +% s1;
        i += 1;
      };

      // Compression
      var a = h0; var b = h1; var c = h2; var d = h3;
      var e = h4; var f = h5; var g = h6; var h = h7;

      var j = 0;
      while (j < 64) {
        let s1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
        let ch = (e & f) ^ ((^ e) & g);
        let temp1 = h +% s1 +% ch +% kConst[j] +% w[j];
        let s0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
        let maj = (a & b) ^ (a & c) ^ (b & c);
        let temp2 = s0 +% maj;
        h := g; g := f; f := e; e := d +% temp1;
        d := c; c := b; b := a; a := temp1 +% temp2;
        j += 1;
      };

      h0 +%= a; h1 +%= b; h2 +%= c; h3 +%= d;
      h4 +%= e; h5 +%= f; h6 +%= g; h7 +%= h;
      blockIdx += 1;
    };

    // Produce 32-byte digest
    let digest = Array.tabulate(
      32,
      func(i) {
        let word : Nat32 = switch (i / 4) {
          case 0 h0; case 1 h1; case 2 h2; case 3 h3;
          case 4 h4; case 5 h5; case 6 h6; case 7 h7;
          case _ 0;
        };
        let iMod = i % 4;
        let shift4 : Nat = if (iMod <= 3) { (3 - iMod) * 8 } else { 0 };
        Nat8.fromNat(((word >> Nat32.fromNat(shift4)) & 0xff).toNat());
      },
    );
    Blob.fromArray(digest);
  };
};
