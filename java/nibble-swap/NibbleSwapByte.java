public class NibbleSwapByte {
    // The lecture version, using the Java type byte (signed!). Casting back to byte needs care.
    public static byte swapNibbles(byte b) {
        byte upperNibble = (byte) ((b & 0xF0) >>> 4);   // b is promoted to int; & 0xF0 removes sign-extension bits
        byte lowerNibble = (byte) (b & 0x0F);
        return (byte) ((lowerNibble << 4) | upperNibble);
    }

    public static void main(String[] args) {
        byte byteValue = (byte) 0xAB;                   // 1010 1011
        byte swappedByte = swapNibbles(byteValue);
        System.out.println("Original byte: " + Integer.toBinaryString(byteValue & 0xFF));
        System.out.println("Swapped byte: " + Integer.toBinaryString(swappedByte & 0xFF));
        System.out.println("as hex: " + Integer.toHexString(byteValue & 0xFF) + " -> " + Integer.toHexString(swappedByte & 0xFF));
    }
}
